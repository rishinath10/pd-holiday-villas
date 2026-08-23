import React, { useState } from 'react';
import { X, Heart, Star, MapPin, Users, BedDouble, Bath, ShieldCheck, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { VillaAvailabilityCalendar } from './VillaAvailabilityCalendar';
import { createBooking } from '../api';
import type { Villa, Booking } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  villa: Villa | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const VillaDetailModal: React.FC<Props> = ({ villa, isOpen, onClose, isFavorite, onToggleFavorite, onBookingConfirmed }) => {
  const { t } = useLanguage();
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !villa) return null;

  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 0;
  const cleaningFee = 50;
  const totalPrice = nights > 0 ? villa.pricePerNight * nights + cleaningFee : 0;

  const handleCalendarSelect = (date: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut('');
    } else if (date > checkIn) {
      setCheckOut(date);
    } else {
      setCheckIn(date);
      setCheckOut('');
    }
  };

  const handleSubmitBooking = async () => {
    setError('');
    if (!checkIn || !checkOut || !guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const booking = await createBooking({
        villaSlug: villa.slug,
        checkIn,
        checkOut,
        guests,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: specialRequests.trim(),
      });
      setCheckIn(''); setCheckOut(''); setGuests(1); setGuestName(''); setGuestEmail(''); setGuestPhone(''); setSpecialRequests('');
      onBookingConfirmed(booking);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FFF9F5] rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-orange-100/50">
          <div className="flex items-center gap-3">
            <button onClick={() => onToggleFavorite(villa.slug)} className="p-2 rounded-full hover:bg-orange-50 transition-colors">
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#FF7E5F] text-[#FF7E5F]' : 'text-slate-400'}`} />
            </button>
            <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-2xl font-bold text-[#1A2A2B]">{villa.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Content — single scrollable view */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Gallery */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
            <img src={villa.images[galleryIndex]?.url} alt={villa.images[galleryIndex]?.alt || villa.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {villa.images.map((_, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === galleryIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slate-100"><Users className="w-4 h-4 text-[#2EB5B2]" /><span className="text-sm"><strong>{villa.sleepsCount}</strong> {t.common.guests}</span></div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slate-100"><BedDouble className="w-4 h-4 text-[#FF7E5F]" /><span className="text-sm"><strong>{villa.bedrooms}</strong> {t.common.bedrooms}</span></div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slate-100"><Bath className="w-4 h-4 text-[#FFB800]" /><span className="text-sm"><strong>{villa.bathrooms}</strong> {t.common.bathrooms}</span></div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slate-100"><Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" /><span className="text-sm"><strong>{villa.rating}</strong> ({villa.reviewsCount})</span></div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4 text-[#FF7E5F] shrink-0" />{villa.location} &mdash; {villa.distanceToBeach}</div>

          <p className="text-sm text-[#57423d] leading-relaxed">{villa.fullDescription}</p>

          {/* Highlights */}
          <div>
            <h4 className="font-['Cormorant_Garamond',serif] text-lg font-bold mb-3">Highlights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {villa.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-sm"><Sparkles className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />{h}</div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="font-['Cormorant_Garamond',serif] text-lg font-bold mb-3">Amenities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {villa.amenities.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="w-4 h-4 text-[#2EB5B2] shrink-0 mt-0.5" />{a}</div>
              ))}
            </div>
          </div>

          {/* Host */}
          <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100">
            <img src={villa.host.avatarUrl} alt={villa.host.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-bold text-sm">{villa.host.name}</div>
              <div className="text-xs text-slate-500">{villa.host.superhost && <span className="text-[#FFB800] font-bold">Superhost</span>} &middot; {villa.host.responseRate}</div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-orange-100/50 shadow-sm space-y-5">
            <div>
              <h4 className="font-['Cormorant_Garamond',serif] text-xl font-bold mb-1">{t.common.bookDirect}</h4>
              <div className="flex items-baseline gap-2 text-sm">
                <span className="text-2xl font-bold font-['Cormorant_Garamond',serif]">RM{villa.pricePerNight}</span>
                <span className="text-slate-500">/{t.common.night}</span>
                <span className="ml-auto text-emerald-600 font-bold text-xs">{t.common.zeroPlatformFee}</span>
              </div>
            </div>

            {/* Calendar */}
            <VillaAvailabilityCalendar
              villaSlug={villa.slug}
              selectedCheckIn={checkIn}
              selectedCheckOut={checkOut}
              onSelectDate={handleCalendarSelect}
            />

            {/* Date summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Check-in</label>
                <input type="date" value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }} className="w-full text-sm font-semibold bg-transparent outline-none" />
              </div>
              <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn} className="w-full text-sm font-semibold bg-transparent outline-none" />
              </div>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Guests</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full text-sm font-semibold bg-transparent outline-none">
                {Array.from({ length: villa.sleepsCount }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>

            {/* Guest info */}
            <div className="space-y-3">
              <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name *</label>
                <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter your full name" className="w-full text-sm bg-transparent outline-none" />
              </div>
              <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email *</label>
                <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="your.email@example.com" className="w-full text-sm bg-transparent outline-none" />
              </div>
              <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Phone *</label>
                <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+60 12-345 6789" className="w-full text-sm bg-transparent outline-none" />
              </div>
              <div className="bg-[#FFF9F5] rounded-xl p-3 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Special Requests</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requests?" rows={2} className="w-full text-sm bg-transparent outline-none resize-none" />
              </div>
            </div>

            {/* Price breakdown */}
            {nights > 0 && (
              <div className="bg-[#FFF9F5] rounded-2xl p-4 border border-orange-100/50 space-y-2 text-sm">
                <div className="flex justify-between"><span>RM{villa.pricePerNight} x {nights} nights</span><span>RM{villa.pricePerNight * nights}</span></div>
                <div className="flex justify-between"><span>Cleaning fee</span><span>RM{cleaningFee}</span></div>
                <div className="flex justify-between text-emerald-600 font-bold"><span>Platform fee</span><span>RM 0 (FREE)</span></div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold"><span>Total</span><span>RM{totalPrice.toLocaleString()}</span></div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />Security deposit: RM{villa.securityDeposit} (100% refundable)</div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            <button
              onClick={handleSubmitBooking}
              disabled={submitting || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone}
              className="w-full py-3.5 rounded-2xl bg-[#FF7E5F] hover:bg-[#a53b22] disabled:bg-slate-300 text-white font-bold text-base transition-all shadow-md disabled:cursor-not-allowed"
            >
              {submitting ? 'Confirming...' : `Confirm Booking — RM${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
