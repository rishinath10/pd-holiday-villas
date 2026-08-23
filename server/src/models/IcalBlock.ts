import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IIcalBlock extends Document {
  villa: Types.ObjectId;
  source: string;
  uid: string;
  summary?: string;
  startDate: Date;
  endDate: Date;
  lastSyncedAt: Date;
}

const icalBlockSchema = new Schema<IIcalBlock>(
  {
    villa: { type: Schema.Types.ObjectId, ref: 'Villa', required: true, index: true },
    source: { type: String, required: true },
    uid: { type: String, required: true },
    summary: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

icalBlockSchema.index({ villa: 1, startDate: 1, endDate: 1 });
icalBlockSchema.index({ villa: 1, uid: 1 }, { unique: true });

export default mongoose.model<IIcalBlock>('IcalBlock', icalBlockSchema);
