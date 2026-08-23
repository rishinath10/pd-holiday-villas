import React, { useState } from 'react';
import { X, Search, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { lookupBooking } from '../api';
import type { Booking } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [ref, setRef] = useState('');
  const [results, setResults] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLookup = async () => {
    if (!email.trim() || !ref.trim()) {
      setError('Please enter both your email and booking reference.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const bookings = await lookupBooking(email.trim(), ref.trim());
      setResults(bookings);
      if (bookings.length === 0) setError('No booking found with those details. Please check and try again.');
    } catch (err: any) {
      setError(err.message || 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'Checked-In': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-slate-100 text-slate-600';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-[#FFF9F5] rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-orange-100/50">
          <h2 className="font-['Cormorant_Garamond',serif] text-xl font-bold">My Bookings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-sm text-slate-600">Enter your email address and booking reference to view your reservation.</p>

          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full text-sm bg-transparent outline-none" />
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Booking Reference</label>
              <input type="text" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} placeholder="BK-123456" className="w-full text-sm bg-transparent outline-none font-mono" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <button onClick={handleLookup} disabled={loading} className="w-full py-3 rounded-2xl bg-[#FF7E5F] hover:bg-[#a53b22] disabled:bg-slate-300 text-white font-bold transition-all flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />{loading ? 'Looking up...' : 'Look Up Booking'}
          </button>

          {results && results.length > 0 && (
            <div className="space-y-3 pt-2">
              {results.map((b) => {
                const villaTitle = typeof b.villa === 'object' ? b.villa.title : '';
                return (
                  <div key={b._id} className="bg-white rounded-2xl p-4 border border-orange-100/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#FF7E5F]">{b.bookingRef}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor(b.status)}`}>{b.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-3.5 h-3.5 text-[#FF7E5F]" />{villaTitle}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar className="w-3.5 h-3.5 text-[#2EB5B2]" />{new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()} ({b.nights} nights)</div>
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-50"><span>Total</span><span>RM{b.totalPrice.toLocaleString()}</span></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
