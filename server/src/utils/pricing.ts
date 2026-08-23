import DatePrice from '../models/DatePrice.js';
import { Types } from 'mongoose';
import { startOfUTCDay } from './validate.js';

export const CLEANING_FEE = 50;

export interface QuoteResult {
  nights: number;
  nightlyTotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
}

/**
 * Prices a stay night-by-night so admin-configured peak/seasonal rates in the
 * DatePrice collection are actually charged. Nights without an override fall
 * back to the villa's base rate. Checkout day is not charged.
 */
export async function quoteStay(
  villaId: Types.ObjectId | string,
  basePricePerNight: number,
  checkIn: Date,
  checkOut: Date
): Promise<QuoteResult> {
  const start = startOfUTCDay(checkIn);
  const end = startOfUTCDay(checkOut);
  const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);

  const overrides = await DatePrice.find({
    villa: villaId,
    date: { $gte: start, $lt: end },
  }).select('date price');

  const byDay = new Map<number, number>();
  for (const o of overrides) {
    byDay.set(startOfUTCDay(o.date).getTime(), o.price);
  }

  let nightlyTotal = 0;
  for (let i = 0; i < nights; i++) {
    const day = start.getTime() + i * 86_400_000;
    nightlyTotal += byDay.get(day) ?? basePricePerNight;
  }

  return {
    nights,
    nightlyTotal,
    cleaningFee: CLEANING_FEE,
    serviceFee: 0,
    totalPrice: nightlyTotal + CLEANING_FEE,
  };
}
