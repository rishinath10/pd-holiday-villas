import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Waves, ShieldCheck, MapPin, Eye, MessageCircle, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { trackWhatsAppClick } from '../lib/analytics';
import type { Villa } from '../types';

interface Props {
  villas: Villa[];
  onExploreVillas: () => void;
  onOpenContact: () => void;
  onNavigateTab?: (tab: string) => void;
  onSelectVilla?: (villa: Villa) => void;
}

export const HeroSection: React.FC<Props> = ({ villas, onExploreVillas, onOpenContact, onNavigateTab, onSelectVilla }) => {
  const { language } = useLanguage();
  const [activeVillaIndex, setActiveVillaIndex] = useState(0);
  const currentVilla = villas[activeVillaIndex] || villas[0];

  useEffect(() => {
    if (villas.length === 0) return;
    const timer = setInterval(() => setActiveVillaIndex((prev) => (prev + 1) % villas.length), 6000);
    return () => clearInterval(timer);
  }, [villas.length]);

  if (!currentVilla) return null;

  return (
    <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-1 sm:pt-2">
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden text-white p-4 sm:p-8 lg:p-10 shadow-2xl border border-teal-900/40">
        <div className="absolute inset-0 z-0 hero-gradient-bg">
          <div className="hero-glow-orb hero-glow-orb--1" />
          <div className="hero-glow-orb hero-glow-orb--2" />
          <div className="hero-glow-orb hero-glow-orb--3" />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-black/30 to-black/15" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-5">
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10.5px] sm:text-xs font-bold border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[#FFECA8]">{language === 'ms' ? '5 Vila Berkonsepkan Bali' : '5 Balinese Beach Villas'}</span>
              <span className="text-white/30 hidden xs:inline">&bull;</span>
              <span className="text-white/90">{language === 'ms' ? '0% Caj Tempahan Terus' : '0% Direct Booking Fee'}</span>
            </div>

            <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              {language === 'ms' ? 'Vila Berkonsepkan Bali Tepi Pantai' : 'Balinese-Inspired Beach Villas in'}{' '}
              <span className="bg-gradient-to-r from-[#FF7E5F] via-[#FEB47B] to-[#FFB800] bg-clip-text text-transparent italic [-webkit-backface-visibility:hidden] [backface-visibility:hidden]">Port Dickson</span>
            </h1>

            <p className="text-[13px] sm:text-base text-white/90 font-medium leading-relaxed max-w-xl">
              {language === 'ms'
                ? 'Koleksi 5 buah vila peribadi berkonsepkan Bali eksklusif di Teluk Kemang & Pantai Cahaya Negeri. Dilengkapi kolam batu Sukabumi semula jadi, ukiran kayu jati mewah, dan akses terus ke pantai.'
                : 'Direct reservations for 5 authentic Balinese-inspired private holiday villas across Teluk Kemang & Pantai Cahaya Negeri. Featuring volcanic Sukabumi stone pools, hand-carved teakwood pavilions, and direct sunset beach access.'}
            </p>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-0.5">
              {[
                { icon: Waves, label: language === 'ms' ? 'Konsep Bali' : 'Balinese', sub: language === 'ms' ? 'Kayu Jati' : 'Teak & Stone', color: 'text-[#FF7E5F]', bg: 'bg-[#FF7E5F]/20' },
                { icon: Sparkles, label: language === 'ms' ? 'Kolam Batu' : 'Stone Pool', sub: language === 'ms' ? 'Sukabumi' : 'Private Pool', color: 'text-[#2EB5B2]', bg: 'bg-[#2EB5B2]/20' },
                { icon: ShieldCheck, label: language === 'ms' ? 'Jimat ~18%' : 'Save ~18%', sub: language === 'ms' ? '0% Caj Web' : 'Direct Price', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
              ].map(({ icon: Icon, label, sub, color, bg }) => (
                <div key={label} className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${bg} ${color} flex items-center justify-center`}><Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                  <div className="text-[10px] sm:text-[11px] leading-tight"><strong className="block text-white font-bold">{label}</strong><span className="text-white/60 text-[9px] sm:text-[10px]">{sub}</span></div>
                </div>
              ))}
            </div>

            <div className="pt-1.5 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full">
              <button onClick={onExploreVillas} className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-full bg-[#FF7E5F] hover:bg-[#a53b22] text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                <span>{language === 'ms' ? 'Terokai Vila Kami' : 'Explore Our Villas'}</span><ArrowRight className="w-4 h-4" />
              </button>
              <a href="https://wa.me/60123552585" target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('hero')} className="px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 hover:text-white text-xs sm:text-sm font-semibold transition-all border border-white/15 flex items-center justify-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /><span>{language === 'ms' ? 'WhatsApp Kami' : 'WhatsApp Us'}</span>
              </a>
            </div>
          </div>

          {/* Right: Villa Spotlight */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-3.5 sm:p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#ffdad2]/80 text-[#a53b22] text-[10.5px] font-bold uppercase tracking-wider">Sleeps {currentVilla.sleepsCount}</span>
                <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 text-xs font-bold text-[#FFB800]">
                  <Star className="w-3.5 h-3.5 fill-[#FFB800]" /><span className="text-white">{currentVilla.rating}</span><span className="text-white/60 text-[10px]">({currentVilla.reviewsCount})</span>
                </div>
              </div>

              <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-inner group">
                <img src={currentVilla.images[0]?.url} alt={currentVilla.images[0]?.alt || currentVilla.title} referrerPolicy="no-referrer" fetchPriority="high" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-emerald-600/95 text-white text-[10px] font-bold flex items-center gap-1 shadow-md border border-emerald-400/40">
                  <span>Direct Booking Savings</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-['Cormorant_Garamond',serif] text-base sm:text-xl font-bold text-white leading-tight truncate">{currentVilla.title}</h3>
                    <p className="text-[10.5px] text-white/80 flex items-center gap-1 mt-0.5 truncate"><MapPin className="w-3 h-3 text-[#FF7E5F] shrink-0" />{currentVilla.location}</p>
                  </div>
                  <div className="text-right shrink-0 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/15">
                    <span className="text-[9.5px] text-white/70 block uppercase font-bold">From</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#FFECA8]">RM{currentVilla.pricePerNight}</span><span className="text-[9.5px] text-white/70">/nt</span>
                  </div>
                </div>
              </div>

              <button onClick={() => onSelectVilla?.(currentVilla)} className="w-full py-2.5 px-4 rounded-xl bg-white text-[#1A2A2B] hover:bg-[#FF7E5F] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <Eye className="w-3.5 h-3.5" />{language === 'ms' ? 'Lihat Butiran Vila & Kalendar' : 'View Villa & Calendar'}
              </button>

              <div className="pt-1 border-t border-white/15">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{language === 'ms' ? 'Vila Kami:' : 'Our Villas:'}</span>
                  <span className="text-[9.5px] text-white/50">{activeVillaIndex + 1} of {villas.length}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {villas.map((v, idx) => (
                    <button key={v.slug} onClick={() => setActiveVillaIndex(idx)} aria-label={`Select ${v.title}`} className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 border-2 ${activeVillaIndex === idx ? 'border-[#FF7E5F] scale-105 shadow-md ring-2 ring-[#FF7E5F]/50' : 'border-white/20 opacity-60 hover:opacity-100'}`}>
                      <img src={v.images[0]?.url} alt={v.images[0]?.alt || v.title} referrerPolicy="no-referrer" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
