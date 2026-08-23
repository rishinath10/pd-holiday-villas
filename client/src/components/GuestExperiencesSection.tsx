import React, { useRef } from 'react';
import { Star, CheckCircle, ThumbsUp, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { GUEST_EXPERIENCES_DATA } from '../data/testimonialsData';
import type { Villa } from '../types';

interface Props {
  onSelectVilla: (villa: Villa) => void;
  villas: Villa[];
}

export const GuestExperiencesSection: React.FC<Props> = ({ onSelectVilla, villas }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('div')?.offsetWidth || 340;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -cardWidth - 20 : cardWidth + 20, behavior: 'smooth' });
  };

  return (
    <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-6 sm:py-10">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#def1f4] text-[#006a68] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">Guest Experiences</span>
          <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-4xl font-bold text-[#1A2A2B]">What Our Guests Say</h2>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#FF7E5F] hover:bg-[#FF7E5F]/5 flex items-center justify-center transition-colors text-slate-500 hover:text-[#FF7E5F]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#FF7E5F] hover:bg-[#FF7E5F]/5 flex items-center justify-center transition-colors text-slate-500 hover:text-[#FF7E5F]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-3 px-3 sm:-mx-0 sm:px-0 no-scrollbar"
      >
        {GUEST_EXPERIENCES_DATA.slice(0, 6).map((exp) => (
          <div key={exp.id} className="bg-[#FFF9F5] rounded-2xl p-5 border border-orange-100/50 shadow-soft flex flex-col shrink-0 w-[300px] sm:w-[340px] snap-start">
            <div className="flex items-center gap-3 mb-3">
              <img src={exp.avatar} alt={`${exp.guestName} avatar`} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-[#1A2A2B] truncate">{exp.guestName}</h4>
                <p className="text-[11px] text-slate-500">{exp.guestLocation}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(exp.rating) ? 'fill-[#FFB800] text-[#FFB800]' : 'text-slate-200'}`} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad2]/50 text-[#a53b22] text-[9px] font-bold">{exp.highlightBadge}</span>
              <span className="text-[10px] text-slate-400">{exp.stayDate}</span>
            </div>
            <h5 className="font-['Playfair_Display',serif] text-base font-bold mb-2 leading-snug">{exp.title}</h5>
            <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-4">{exp.quote}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-orange-100/50 text-[11px] text-slate-500">
              <button
                onClick={() => { const v = villas.find((v) => v.slug === exp.villaId); if (v) onSelectVilla(v); }}
                className="flex items-center gap-1 hover:text-[#FF7E5F] transition-colors"
              >
                <MapPin className="w-3 h-3" />{exp.villaTitle}
              </button>
              <div className="flex items-center gap-3">
                {exp.verifiedStay && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3 h-3" />Verified</span>}
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{exp.helpfulCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
