import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import AdminUser from '../models/AdminUser.js';
import Booking from '../models/Booking.js';
import Villa from '../models/Villa.js';
import IcalBlock from '../models/IcalBlock.js';
import DatePrice from '../models/DatePrice.js';
import mongoose from 'mongoose';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { generateBookingRef } from '../utils/bookingRef.js';
import { checkOverlap } from '../utils/overlapCheck.js';
import { syncAllIcalFeeds } from '../utils/icalSync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'villas');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only .jpg, .jpeg, .png, .webp, .avif files are allowed'));
  },
});

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

router.post('/login', loginLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ name: admin.name, email: admin.email, role: admin.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (_req: AuthRequest, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await AdminUser.findById(req.adminId).select('-passwordHash');
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.json(admin);
  } catch {
    res.status(500).json({ error: 'Failed to fetch admin' });
  }
});

router.get('/bookings', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('villa', 'title slug images location pricePerNight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.patch('/bookings/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('villa', 'title slug images');

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(booking);
  } catch {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

router.post('/bookings', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { villaId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, paymentChannel, specialRequests } = req.body;

    if (!villaId || !checkIn || !checkOut || !guestName) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const villa = await Villa.findById(villaId);
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

    const { hasOverlap, conflictSource } = await checkOverlap(String(villa._id), checkInDate, checkOutDate);
    if (hasOverlap) {
      res.status(409).json({ error: `Dates unavailable: ${conflictSource}` });
      return;
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const cleaningFee = 50;
    const totalPrice = villa.pricePerNight * nights + cleaningFee;

    const booking = await Booking.create({
      bookingRef: generateBookingRef(),
      villa: villa._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guests || 1,
      guestName,
      guestEmail: guestEmail?.toLowerCase().trim() || '',
      guestPhone: guestPhone || '',
      specialRequests: specialRequests || '',
      totalPrice,
      cleaningFee,
      serviceFee: 0,
      securityDeposit: villa.securityDeposit,
      status: 'Confirmed',
      source: 'Manual (Admin)',
      paymentChannel: paymentChannel || 'Manual Bank Transfer',
    });

    const populated = await booking.populate('villa', 'title slug images');
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.patch('/villas/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const allowedFields = ['pricePerNight', 'securityDeposit', 'title', 'tagline', 'description', 'fullDescription', 'amenities', 'highlights', 'sleepsCount', 'bedrooms', 'bathrooms', 'location', 'distanceToBeach', 'images', 'icalImportUrls', 'category', 'badgeCategory', 'googleLink'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const villa = await Villa.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    res.json(villa);
  } catch {
    res.status(500).json({ error: 'Failed to update villa' });
  }
});

router.post('/villas/:id/ical-sources', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { source, url } = req.body;
    if (!source || !url) {
      res.status(400).json({ error: 'Source and URL are required' });
      return;
    }

    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    villa.icalImportUrls.push({ source, url });
    await villa.save();

    res.json(villa);
  } catch {
    res.status(500).json({ error: 'Failed to add iCal source' });
  }
});

router.delete('/bookings/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json({ message: 'Booking deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

router.get('/villas/:id/date-prices', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prices = await DatePrice.find({ villa: req.params.id }).sort({ date: 1 });
    res.json(prices);
  } catch {
    res.status(500).json({ error: 'Failed to fetch date prices' });
  }
});

router.post('/villas/:id/date-prices', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { dates, price, label } = req.body;
    if (!dates || !Array.isArray(dates) || !price) {
      res.status(400).json({ error: 'dates (array) and price are required' });
      return;
    }

    const villaId = new mongoose.Types.ObjectId(req.params.id);
    const ops = dates.map((d: string) => ({
      updateOne: {
        filter: { villa: villaId, date: new Date(d) },
        update: { $set: { villa: villaId, date: new Date(d), price, label: label || 'custom' } },
        upsert: true,
      },
    }));

    await DatePrice.bulkWrite(ops);
    const updated = await DatePrice.find({ villa: req.params.id }).sort({ date: 1 });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to set date prices' });
  }
});

router.delete('/villas/:id/date-prices', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { dates } = req.body;
    if (!dates || !Array.isArray(dates)) {
      res.status(400).json({ error: 'dates (array) is required' });
      return;
    }

    const dateDocs = dates.map((d: string) => new Date(d));
    await DatePrice.deleteMany({ villa: req.params.id, date: { $in: dateDocs } });
    res.json({ message: 'Date prices deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete date prices' });
  }
});

router.delete('/villas/:id/ical-sources/:sourceIndex', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) {
      res.status(404).json({ error: 'Villa not found' });
      return;
    }

    const index = parseInt(req.params.sourceIndex, 10);
    if (isNaN(index) || index < 0 || index >= villa.icalImportUrls.length) {
      res.status(400).json({ error: 'Invalid source index' });
      return;
    }

    villa.icalImportUrls.splice(index, 1);
    await villa.save();
    res.json(villa);
  } catch {
    res.status(500).json({ error: 'Failed to delete iCal source' });
  }
});

router.post('/sync/ical', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const results = await syncAllIcalFeeds();
    res.json({ message: 'Sync completed', results });
  } catch (err) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

router.post('/villas/:id/images', requireAuth, upload.array('images', 20), async (req: AuthRequest, res: Response) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) { res.status(404).json({ error: 'Villa not found' }); return; }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) { res.status(400).json({ error: 'No files uploaded' }); return; }

    const newImages = files.map(f => ({
      url: `/uploads/villas/${f.filename}`,
      alt: villa.title,
    }));

    villa.images.push(...newImages);
    await villa.save();
    res.json(villa);
  } catch {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

router.delete('/villas/:id/images/:imageIndex', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) { res.status(404).json({ error: 'Villa not found' }); return; }

    const index = parseInt(req.params.imageIndex, 10);
    if (isNaN(index) || index < 0 || index >= villa.images.length) {
      res.status(400).json({ error: 'Invalid image index' }); return;
    }

    const img = villa.images[index];
    if (img.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', img.url);
      fs.unlink(filePath, () => {});
    }

    villa.images.splice(index, 1);
    await villa.save();
    res.json(villa);
  } catch {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

router.put('/villas/:id/images', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) { res.status(404).json({ error: 'Villa not found' }); return; }

    const { images } = req.body;
    if (!Array.isArray(images)) { res.status(400).json({ error: 'images array is required' }); return; }

    villa.images = images;
    await villa.save();
    res.json(villa);
  } catch {
    res.status(500).json({ error: 'Failed to reorder images' });
  }
});

export default router;
