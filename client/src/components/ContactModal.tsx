import React from 'react';
import { X, MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FFF9F5] rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-orange-100/50">
          <h2 className="font-['Cormorant_Garamond',serif] text-xl font-bold">Contact Us</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-orange-100/50 space-y-4">
            <div className="flex items-center gap-3 text-sm"><MessageCircle className="w-5 h-5 text-[#25D366]" /><div><strong>WhatsApp</strong><p className="text-slate-500 text-xs">+60 12-355 2585 (Manager Jeff)</p></div></div>
            <div className="flex items-center gap-3 text-sm"><Mail className="w-5 h-5 text-[#FF7E5F]" /><div><strong>Email</strong><p className="text-slate-500 text-xs">pdholidayvillas@gmail.com</p></div></div>
            <div className="flex items-center gap-3 text-sm"><Phone className="w-5 h-5 text-[#2EB5B2]" /><div><strong>Phone</strong><p className="text-slate-500 text-xs">+60 12-355 2585</p></div></div>
            <div className="flex items-center gap-3 text-sm"><MapPin className="w-5 h-5 text-[#FFB800]" /><div><strong>Location</strong><p className="text-slate-500 text-xs">Port Dickson, Negeri Sembilan, Malaysia</p></div></div>
            <div className="flex items-center gap-3 text-sm"><Clock className="w-5 h-5 text-slate-400" /><div><strong>Response Time</strong><p className="text-slate-500 text-xs">100% within 15 minutes</p></div></div>
          </div>
          <a href="https://wa.me/60123552585?text=Hi%20Manager%20Jeff%2C%20I%27m%20interested%20in%20booking%20a%20villa%20at%20PD%20Holiday%20Villas." target="_blank" rel="noopener noreferrer" className="block w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-center transition-all shadow-md">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
