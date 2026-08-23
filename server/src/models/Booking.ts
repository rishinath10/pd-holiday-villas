import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  bookingRef: string;
  villa: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  totalPrice: number;
  cleaningFee: number;
  serviceFee: number;
  securityDeposit: number;
  status: 'Pending' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';
  source: 'Direct' | 'Airbnb Sync' | 'Booking.com Sync' | 'Agoda Sync' | 'Manual (Admin)';
  paymentChannel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingRef: { type: String, required: true, unique: true, index: true },
    villa: { type: Schema.Types.ObjectId, ref: 'Villa', required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    guests: { type: Number, required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    specialRequests: String,
    totalPrice: { type: Number, required: true },
    cleaningFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    source: {
      type: String,
      required: true,
      enum: ['Direct', 'Airbnb Sync', 'Booking.com Sync', 'Agoda Sync', 'Manual (Admin)'],
      default: 'Direct',
    },
    paymentChannel: String,
  },
  { timestamps: true }
);

bookingSchema.index({ villa: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
