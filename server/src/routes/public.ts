import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import Villa from '../models/Villa.js';
import Booking from '../models/Booking.js';
import IcalBlock from '../models/IcalBlock.js';
import DatePrice from '../models/DatePrice.js';
import { generateBookingRef } from '../utils/bookingRef.js';
import { checkOverlap } from '../utils/overlapCheck.js';
import { quoteStay } from '../utils/pricing.js';
import { asString, asEmail, asPhone, asInt, asDate, startOfUTCDay } from '../utils/validate.js';
import icalGenerator from 'ical-generator';
import { timingSafeEqual } from 'crypto';

/** Constant-time compare so export tokens can't be recovered byte-by-byte. */
function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const router = Router();

// Creating bookings writes to the DB and blocks calendar dates — strictly capped.
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many booking attempts. Please contact us on WhatsApp.' },
});

// Lookup takes email + reference; throttled so references cannot be brute-forced.
const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many lookup attempts. Please try again later.' },
});

router.get('/villas', async (_req: Request, res: Response) => {
  try {
    const villas = await Villa.find().sort({ createdAt: 1 });
    res.json(villas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch villas' });
  }
});

router.get('/villas/:slug', async (req: Request, res: Response) => {
  try {
    const villa = await Villa.findOne({ slug: req.params.slug });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }
    res.json(villa);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch villa' });
  }
});

router.get('/villas/:slug/availability', async (req: Request, res: Response) => {
  try {
    const villa = await Villa.findOne({ slug: req.params.slug });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    const from = asDate(req.query.from) ?? new Date();
    const to = asDate(req.query.to) ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    if (from >= to) {
      res.status(400).json({ error: '`from` must be before `to`' });
      return;
    }

    const bookings = await Booking.find({
      villa: villa._id,
      status: { $in: ['Pending', 'Confirmed', 'Checked-In'] },
      checkIn: { $lt: to },
      checkOut: { $gt: from },
    }).select('checkIn checkOut source');

    const icalBlocks = await IcalBlock.find({
      villa: villa._id,
      startDate: { $lt: to },
      endDate: { $gt: from },
    }).select('startDate endDate source');

    const busyDates: { start: string; end: string; source: string }[] = [];

    for (const b of bookings) {
      busyDates.push({
        start: b.checkIn.toISOString().split('T')[0],
        end: b.checkOut.toISOString().split('T')[0],
        source: b.source,
      });
    }

    for (const block of icalBlocks) {
      busyDates.push({
        start: block.startDate.toISOString().split('T')[0],
        end: block.endDate.toISOString().split('T')[0],
        source: block.source,
      });
    }

    res.json({ villaSlug: req.params.slug, from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0], busyDates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

router.post('/bookings', bookingLimiter, async (req: Request, res: Response) => {
  try {
    const villaSlug = asString(req.body?.villaSlug, 120);
    const guestName = asString(req.body?.guestName, 120);
    const guestEmail = asEmail(req.body?.guestEmail);
    const guestPhone = asPhone(req.body?.guestPhone);
    const checkInDate = asDate(req.body?.checkIn);
    const checkOutDate = asDate(req.body?.checkOut);
    const specialRequests = req.body?.specialRequests
      ? asString(req.body.specialRequests, 1000)
      : '';

    if (!villaSlug || !guestName || !checkInDate || !checkOutDate) {
      res.status(400).json({ error: 'Missing or invalid required fields' });
      return;
    }
    if (!guestEmail) {
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }
    if (!guestPhone) {
      res.status(400).json({ error: 'A valid phone number is required' });
      return;
    }
    if (specialRequests === null) {
      res.status(400).json({ error: 'Special requests must be under 1000 characters' });
      return;
    }

    const villa = await Villa.findOne({ slug: villaSlug });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    // Capacity is defined by the villa, not by whatever the client posts.
    const guests = asInt(req.body?.guests, 1, villa.sleepsCount);
    if (guests === null) {
      res.status(400).json({ error: `Guests must be between 1 and ${villa.sleepsCount}` });
      return;
    }

    const start = startOfUTCDay(checkInDate);
    const end = startOfUTCDay(checkOutDate);

    if (start >= end) {
      res.status(400).json({ error: 'Check-out must be after check-in' });
      return;
    }
    if (start < startOfUTCDay(new Date())) {
      res.status(400).json({ error: 'Check-in date cannot be in the past' });
      return;
    }

    const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    if (nights > 60) {
      res.status(400).json({ error: 'Stays longer than 60 nights must be arranged directly' });
      return;
    }

    const { hasOverlap, conflictSource } = await checkOverlap(String(villa._id), start, end);
    if (hasOverlap) {
      res.status(409).json({ error: `Dates unavailable: ${conflictSource}` });
      return;
    }

    const quote = await quoteStay(villa._id, villa.pricePerNight, start, end);

    const booking = await Booking.create({
      bookingRef: generateBookingRef(),
      villa: villa._id,
      checkIn: start,
      checkOut: end,
      nights: quote.nights,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests: specialRequests || '',
      totalPrice: quote.totalPrice,
      cleaningFee: quote.cleaningFee,
      serviceFee: quote.serviceFee,
      securityDeposit: villa.securityDeposit,
      status: 'Confirmed',
      source: 'Direct',
    });

    const populated = await booking.populate('villa', 'title slug images');

    res.status(201).json(populated);
  } catch (err) {
    // A duplicate key here means two requests raced for the same dates.
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({ error: 'Those dates were just booked. Please pick another range.' });
      return;
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/bookings/lookup', lookupLimiter, async (req: Request, res: Response) => {
  try {
    // Both must be proven strings: Express turns `?email[$ne]=x` into an object.
    const email = asEmail(req.query.email);
    const ref = asString(req.query.ref, 40);

    if (!email || !ref) {
      res.status(400).json({ error: 'Both email and booking reference are required' });
      return;
    }

    const bookings = await Booking.find({
      guestEmail: email,
      bookingRef: ref.toUpperCase(),
    }).populate('villa', 'title slug images location');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to look up booking' });
  }
});

router.get('/villas/:slug/date-prices', async (req: Request, res: Response) => {
  try {
    const villa = await Villa.findOne({ slug: req.params.slug });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prices = await DatePrice.find({
      villa: villa._id,
      date: { $gte: today },
    }).sort({ date: 1 });

    res.json(prices);
  } catch {
    res.status(500).json({ error: 'Failed to fetch date prices' });
  }
});

router.get('/villas/:slug/calendar.ics', async (req: Request, res: Response) => {
  try {
    const villa = await Villa.findOne({ slug: req.params.slug });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    const token = asString(req.query.token, 200);
    if (!token || !villa.icalExportToken || !timingSafeEqualStr(token, villa.icalExportToken)) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }

    const bookings = await Booking.find({
      villa: villa._id,
      status: { $in: ['Confirmed', 'Checked-In'] },
    });

    const calendar = icalGenerator({ name: `${villa.title} - PD Holiday Villas` });

    for (const b of bookings) {
      calendar.createEvent({
        start: b.checkIn,
        end: b.checkOut,
        summary: `Booked: ${villa.title}`,
        description: `Booking ${b.bookingRef} - ${b.guestName}`,
        id: `${b.bookingRef}@pdholidayvillas.com`,
      });
    }

    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${villa.slug}.ics"`);
    res.send(calendar.toString());
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate calendar' });
  }
});

export default router;
