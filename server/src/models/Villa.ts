import mongoose, { Schema, Document } from 'mongoose';

export interface IVillaImage {
  url: string;
  alt: string;
}

export interface IIcalSource {
  source: 'airbnb' | 'booking.com' | 'agoda' | 'other';
  url: string;
}

export interface IVilla extends Document {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  category: 'Beachfront' | 'Ocean View' | 'Private Pool' | 'Family Chalet' | 'Romantic Escape';
  badgeCategory: string;
  sleepsCount: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  securityDeposit: number;
  images: IVillaImage[];
  amenities: string[];
  highlights: string[];
  location: string;
  distanceToBeach: string;
  host: {
    name: string;
    avatarUrl: string;
    superhost: boolean;
    responseRate: string;
  };
  googleLink?: string;
  icalImportUrls: IIcalSource[];
  icalExportToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const villaSchema = new Schema<IVilla>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Beachfront', 'Ocean View', 'Private Pool', 'Family Chalet', 'Romantic Escape'],
    },
    badgeCategory: { type: String, required: true },
    sleepsCount: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    pricePerNight: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
      },
    ],
    amenities: [String],
    highlights: [String],
    location: { type: String, required: true },
    distanceToBeach: { type: String, required: true },
    host: {
      name: { type: String, required: true },
      avatarUrl: { type: String, required: true },
      superhost: { type: Boolean, default: false },
      responseRate: { type: String, default: '' },
    },
    googleLink: String,
    icalImportUrls: [
      {
        source: { type: String, enum: ['airbnb', 'booking.com', 'agoda', 'other'] },
        url: String,
      },
    ],
    icalExportToken: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVilla>('Villa', villaSchema);
