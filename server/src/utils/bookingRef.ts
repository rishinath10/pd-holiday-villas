import crypto from 'crypto';

export function generateBookingRef(): string {
  const num = crypto.randomInt(100000, 999999);
  return `BK-${num}`;
}
