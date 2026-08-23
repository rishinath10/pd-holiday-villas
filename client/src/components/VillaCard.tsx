import React from 'react';
import { Heart, Star, ExternalLink } from 'lucide-react';
import type { Villa } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface VillaCardProps {
  villa: Villa;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  onSelectVilla: (villa: Villa) => void;
  onBookDirect: (villa: Villa) => void;
}

export const VillaCard: React.FC<VillaCardProps> = ({ villa, isFavorite, onToggleFavorite, onSelectVilla, onBookDirect }) => {
  const { t } = useLanguage();
  const mainImage = villa.images[0];

  return (
    <div className="group bg-[#FFF9F5] rounded-[2rem] p-4 sm:p-5 shadow-soft hover:shadow-card-hover transition-all duration-300 border border-orange-100/60 flex flex-col justify-between">
      <div>
        <div onClick={() => onSelectVilla(villa)} className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-slate-100">
          <img src={mainImage?.url} alt={mainImage?.alt || villa.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <button type="button" onClick={(e) => { e.stopPropagation(); onToggleFavorite(villa.slug); }} aria-label="Save to favorites" className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all text-slate-700 hover:text-[#FF7E5F]">
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-[#FF7E5F] text-[#FF7E5F]' : 'stroke-[2.2]'}`} />
          </button>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs shadow-md flex items-center gap-1 text-xs font-bold text-[#1A2A2B]">
            <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
            <span>{villa.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 mb-3">
          <span className="px-3 py-1 rounded-full bg-[#ffdad2]/70 text-[#a53b22] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
            Sleeps {villa.sleepsCount}
          </span>
          {villa.googleLink && (
            <a href={villa.googleLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="ml-auto p-1.5 rounded-full text-slate-400 hover:text-[#006a68] hover:bg-[#def1f4] transition-colors flex items-center gap-1 text-[10px] font-bold" title="View on Google">
              <ExternalLink className="w-3.5 h-3.5 text-[#FF7E5F]" />
              <span className="hidden sm:inline text-slate-600">Google</span>
            </a>
          )}
        </div>
        <h3 onClick={() => onSelectVilla(villa)} className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#1A2A2B] group-hover:text-[#a53b22] transition-colors cursor-pointer leading-tight mb-2">
          {villa.title}
        </h3>
        <p className="font-['Jost',sans-serif] text-sm text-[#57423d] font-medium line-clamp-2 leading-snug mb-5">
          {villa.tagline || villa.description}
        </p>
      </div>
      <div className="pt-3 border-t border-orange-100/70 flex items-center justify-between mt-auto">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.common.from}</span>
          <div className="flex items-baseline gap-1">
            <span className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1A2A2B]">RM{villa.pricePerNight}</span>
            <span className="text-xs text-slate-500 font-semibold">/{t.common.night}</span>
          </div>
        </div>
        <button type="button" onClick={() => onBookDirect(villa)} className="px-5 py-2 rounded-full font-['Jost',sans-serif] text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 bg-[#FF7E5F] hover:bg-[#a53b22] text-white">
          Book
        </button>
      </div>
    </div>
  );
};
