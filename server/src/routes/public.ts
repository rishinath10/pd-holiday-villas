import { Router, Request, Response } from 'express';
import Villa from '../models/Villa.js';
import Booking from '../models/Booking.js';
import IcalBlock from '../models/IcalBlock.js';
import DatePrice from '../models/DatePrice.js';
import { generateBookingRef } from '../utils/bookingRef.js';
import { checkOverlap } from '../utils/overlapCheck.js';
import icalGenerator from 'ical-generator';

const router = Router();

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

    const from = req.query.from ? new Date(req.query.from as string) : new Date();
    const to = req.query.to
      ? new Date(req.query.to as string)
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

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

router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const { villaSlug, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, specialRequests } = req.body;

    if (!villaSlug || !checkIn || !checkOut || !guests || !guestName || !guestEmail || !guestPhone) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const villa = await Villa.findOne({ slug: villaSlug });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      res.status(400).json({ error: 'Check-out must be after check-in' });
      return;
    }

    if (checkInDate < new Date(new Date().toISOString().split('T')[0])) {
      res.status(400).json({ error: 'Check-in date cannot be in the past' });
      return;
    }

    const { hasOverlap, conflictSource } = await checkOverlap(String(villa._id), checkInDate, checkOutDate);
    if (hasOverlap) {
      res.status(409).json({ error: `Dates unavailable: ${conflictSource}` });
      return;
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const cleaningFee = 50;
    const serviceFee = 0;
    const totalPrice = villa.pricePerNight * nights + cleaningFee + serviceFee;

    const booking = await Booking.create({
      bookingRef: generateBookingRef(),
      villa: villa._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests,
      guestName,
      guestEmail: guestEmail.toLowerCase().trim(),
      guestPhone,
      specialRequests: specialRequests || '',
      totalPrice,
      cleaningFee,
      serviceFee,
      securityDeposit: villa.securityDeposit,
      status: 'Confirmed',
      source: 'Direct',
    });

    const populated = await booking.populate('villa', 'title slug images');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/bookings/lookup', async (req: Request, res: Response) => {
  try {
    const { email, ref } = req.query;
    if (!email || !ref) {
      res.status(400).json({ error: 'Both email and booking reference are required' });
      return;
    }

    const bookings = await Booking.find({
      guestEmail: (email as string).toLowerCase().trim(),
      bookingRef: (ref as string).toUpperCase().trim(),
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

    if (req.query.token !== villa.icalExportToken) {
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
