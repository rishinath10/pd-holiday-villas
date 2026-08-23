export interface VillaImage {
  url: string;
  alt: string;
}

export interface Villa {
  _id: string;
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
  images: VillaImage[];
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
  icalImportUrls?: IcalSource[];
}

export interface Booking {
  _id: string;
  bookingRef: string;
  villa: Villa | { _id: string; title: string; slug: string; images: VillaImage[]; location?: string; pricePerNight?: number };
  checkIn: string;
  checkOut: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface BusyDate {
  start: string;
  end: string;
  source: string;
}

export interface AvailabilityResponse {
  villaSlug: string;
  from: string;
  to: string;
  busyDates: BusyDate[];
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export interface DatePrice {
  _id: string;
  villa: string;
  date: string;
  price: number;
  label?: string;
}

export interface IcalSource {
  source: 'airbnb' | 'booking.com' | 'agoda' | 'other';
  url: string;
}

export interface GuestExperience {
  id: string;
  guestName: string;
  guestLocation: string;
  avatar: string;
  villaId: string;
  villaTitle: string;
  rating: number;
  stayDate: string;
  stayType: 'Family Holiday' | 'Romantic Escape' | 'Friends Reunion' | 'Solo Recharge';
  title: string;
  quote: string;
  highlightBadge: string;
  guestPhoto?: string;
  helpfulCount: number;
  verifiedStay: boolean;
}

export interface TravelSpot {
  id: string;
  title: string;
  category: 'Nature & Views' | 'Historic' | 'Family Fun' | 'Seafood & Foodie' | 'Beach & Water';
  description: string;
  image: string;
  driveTime: string;
  insiderTip: string;
  rating: number;
}

export interface StoryArticle {
  id: string;
  title: string;
  readTime: string;
  category: string;
  image: string;
  snippet: string;
  content: string[];
  author: string;
  date: string;
}
