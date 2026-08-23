import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Percent, Zap } from 'lucide-react';

export const OTAChannelsCarousel: React.FC = () => {
  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none font-['Jost',sans-serif] space-y-4 sm:space-y-5">
      {/* 0% Service & Platform Fees Direct Booking Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#103752] via-[#0b4d58] to-[#125B6C] p-4 sm:p-6 text-white shadow-xl border border-teal-500/20">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#FF7E5F]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#2EB5B2]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7E5F] to-[#FEB47B] flex items-center justify-center text-white shadow-lg shrink-0">
              <Percent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-[#2EB5B2] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                  Direct Guest Guarantee
                </span>
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Best Rate Guaranteed
                </span>
              </div>
              <h3 className="font-['Playfair_Display',serif] text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                0% Service & Platform Fees &bull; Book Direct & Save
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl mt-0.5">
                No hidden OTA commissions, no middleman markups. Enjoy 100% transparent pricing and direct host concierge with PD Holiday Villas Sdn. Bhd.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-semibold text-teal-200 uppercase">You Save</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#FFECA8]">15% - 20%</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#FF7E5F] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Zap className="w-4 h-4 fill-white" />
              <span>RM 0 Platform Fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Platforms Infinite Carousel */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-md border border-orange-100/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#006a68]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Also Proudly Listed & Verified On
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Top Rated Hospitality Partner in Port Dickson, Malaysia
          </span>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative overflow-hidden w-full py-2">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-6 sm:gap-10 w-max animate-[marquee_24s_linear_infinite] hover:[animation-play-state:paused]">
            {[1, 2, 3].map((cycle) => (
              <React.Fragment key={cycle}>
                {/* Airbnb */}
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 hover:bg-red-50/50 border border-slate-100 hover:border-red-200 transition-all shadow-2xs group min-w-[210px]">
                  <svg className="w-7 h-7 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1C11.5 1 7.2 4.4 7.2 9.9c0 4.3 2.6 8.7 5.7 13.1 1 1.4 2.1 2.8 3.1 4.1 1-1.3 2.1-2.7 3.1-4.1 3.1-4.4 5.7-8.8 5.7-13.1C24.8 4.4 20.5 1 16 1zm0 21.6c-2.3-3.4-4.5-7.1-4.5-10.4 0-3.6 2.7-6 5.6-6s5.6 2.4 5.6 6c0 3.3-2.2 7-4.5 10.4h-2.2zm0-13.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2 3.2-1.4 3.2-3.2-1.4-3.2-3.2-3.2z" fill="#FF5A5F" />
                  </svg>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-['Jost',sans-serif] font-black text-base tracking-tight text-[#FF5A5F]">airbnb</span>
                      <span className="text-[9px] font-extrabold bg-[#FF5A5F]/10 text-[#FF5A5F] px-1.5 py-0.5 rounded uppercase">Superhost</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">4.92 ★ Guest Favorite</div>
                  </div>
                </div>

                {/* Booking.com */}
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all shadow-2xs group min-w-[220px]">
                  <div className="w-8 h-8 rounded-lg bg-[#003580] flex items-center justify-center text-white font-black text-base shadow-xs shrink-0">B.</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-['Jost',sans-serif] font-black text-base tracking-tight text-[#003580]">Booking<span className="text-[#00BAF2]">.com</span></span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium"><span className="text-[#003580] font-bold">9.6 / 10</span> Exceptional Partner</div>
                  </div>
                </div>

                {/* Agoda */}
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 transition-all shadow-2xs group min-w-[210px]">
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E51B24]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F37023]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4BB246]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#009FE3]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#672D8B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-['Jost',sans-serif] font-black text-base tracking-tight text-[#002D62] lowercase">agoda</span>
                      <span className="text-[9px] font-extrabold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded uppercase">Choice</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Top Villa Host 2026</div>
                  </div>
                </div>

                {/* Direct Booking */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 min-w-[200px]">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                  <div>
                    <div className="text-xs font-extrabold text-emerald-950">0% Commission</div>
                    <div className="text-[11px] text-emerald-700 font-medium">Direct Booking Advantage</div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
