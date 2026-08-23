import mongoose, { Schema, Document } from 'mongoose';

export interface IDatePrice extends Document {
  villa: mongoose.Types.ObjectId;
  date: Date;
  price: number;
  label?: string;
  createdAt: Date;
  updatedAt: Date;
}

const datePriceSchema = new Schema<IDatePrice>(
  {
    villa: { type: Schema.Types.ObjectId, ref: 'Villa', required: true, index: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    label: { type: String, default: 'custom' },
  },
  { timestamps: true }
);

datePriceSchema.index({ villa: 1, date: 1 }, { unique: true });

export default mongoose.model<IDatePrice>('DatePrice', datePriceSchema);
