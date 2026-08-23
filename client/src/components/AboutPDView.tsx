import React from 'react';
import { Star, Clock, Lightbulb, MapPin } from 'lucide-react';
import { TRAVEL_SPOTS } from '../data/guideData';

export const AboutPDView: React.FC = () => (
  <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-4 sm:pt-6 space-y-8">
    <div className="text-center">
      <span className="inline-block px-4 py-1.5 rounded-full bg-[#def1f4] text-[#006a68] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">Destination Guide</span>
      <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-4xl font-bold text-[#1A2A2B]">Port Dickson, Negeri Sembilan</h2>
      <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">Malaysia's most beloved Malacca Strait coastal getaway — golden beaches, historic landmarks, and legendary seafood.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {TRAVEL_SPOTS.map((spot) => (
        <div key={spot.id} className="bg-[#FFF9F5] rounded-2xl overflow-hidden border border-orange-100/50 shadow-soft group">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={spot.image} alt={spot.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-[#1A2A2B] flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />{spot.rating}
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#ffdad2]/90 text-[10px] font-bold text-[#a53b22]">{spot.category}</div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-['Cormorant_Garamond',serif] text-lg font-bold">{spot.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{spot.description}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{spot.driveTime}</div>
            <div className="flex items-start gap-1.5 text-xs text-[#006a68] bg-[#def1f4] rounded-lg p-2.5"><Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />{spot.insiderTip}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
