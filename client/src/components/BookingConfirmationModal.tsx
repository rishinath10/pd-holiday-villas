import React from 'react';
import { X, CheckCircle, Calendar, Users, MapPin, ShieldCheck, MessageCircle } from 'lucide-react';
import type { Booking } from '../types';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<Props> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const villaTitle = typeof booking.villa === 'object' ? booking.villa.title : '';
  const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const whatsappMessage = encodeURIComponent(
`Hello Manager Jeff,

I have just made a booking on PD Holiday Villas and would like to complete the payment.

📋 *BOOKING SUMMARY*
━━━━━━━━━━━━━━━━━━
🏷️ Booking Ref: ${booking.bookingRef}
🏡 Villa: ${villaTitle}
📅 Check-in: ${checkInDate}
📅 Check-out: ${checkOutDate}
🌙 Nights: ${booking.nights}
👥 Guests: ${booking.guests}
💰 Total: RM ${booking.totalPrice.toLocaleString()}
🛡️ Security Deposit: RM ${booking.securityDeposit}
━━━━━━━━━━━━━━━━━━

👤 Name: ${booking.guestName}
📧 Email: ${booking.guestEmail}
📱 Phone: ${booking.guestPhone}${booking.specialRequests ? `\n📝 Special Requests: ${booking.specialRequests}` : ''}

Please let me know how to proceed with the payment. Thank you!`
  );

  const whatsappUrl = `https://wa.me/60123552585?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FFF9F5] rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up p-6 sm:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1A2A2B]">Booking Submitted!</h2>
          <p className="text-sm text-slate-600">Your reservation details have been saved. Complete your booking by contacting Manager Jeff via WhatsApp to arrange payment.</p>

          <div className="bg-white rounded-2xl p-4 border border-orange-100/50 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Booking Reference</span>
              <span className="font-mono font-bold text-[#FF7E5F] text-lg">{booking.bookingRef}</span>
            </div>
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-[#FF7E5F] shrink-0" />{villaTitle}</div>
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-[#2EB5B2] shrink-0" />{checkInDate} — {checkOutDate} ({booking.nights} nights)</div>
            <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-[#FFB800] shrink-0" />{booking.guests} guests</div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">RM{booking.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />Security deposit: RM{booking.securityDeposit} (refundable)</div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Complete Booking via WhatsApp
          </a>

          <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-800 border border-emerald-200">
            Manager Jeff will confirm your booking and guide you through payment via bank transfer / FPX. Save your booking reference for tracking.
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
