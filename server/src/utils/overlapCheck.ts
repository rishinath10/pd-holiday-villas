import Booking from '../models/Booking.js';
import IcalBlock from '../models/IcalBlock.js';
import { Types } from 'mongoose';

export async function checkOverlap(
  villaId: Types.ObjectId | string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<{ hasOverlap: boolean; conflictSource?: string }> {
  const bookingQuery: Record<string, unknown> = {
    villa: villaId,
    status: { $in: ['Pending', 'Confirmed', 'Checked-In'] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeBookingId) {
    bookingQuery._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(bookingQuery);
  if (conflictingBooking) {
    return { hasOverlap: true, conflictSource: `Existing booking ${conflictingBooking.bookingRef}` };
  }

  const conflictingIcal = await IcalBlock.findOne({
    villa: villaId,
    startDate: { $lt: checkOut },
    endDate: { $gt: checkIn },
  });
  if (conflictingIcal) {
    return { hasOverlap: true, conflictSource: `External booking from ${conflictingIcal.source}` };
  }

  return { hasOverlap: false };
}
