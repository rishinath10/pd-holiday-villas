import React from 'react';
import { Clock, ShieldCheck, Users, Droplets, Music, ArrowRight } from 'lucide-react';

interface Props {
  onNavigateToRules: () => void;
}

export const HomeHouseRulesSection: React.FC<Props> = ({ onNavigateToRules }) => {
  const highlights = [
    { icon: Clock, title: 'Check-in / Check-out', desc: 'Check-in from 3:00 PM, check-out by 12:00 PM noon.', color: 'text-[#2EB5B2]', bg: 'bg-[#2EB5B2]/10' },
    { icon: ShieldCheck, title: 'Security Deposit', desc: 'RM 1,000 for The Bay, Bella Vista & Sounds of the Sea. RM 500 for Nuri & Bird\'s Nest.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Users, title: 'Maximum Occupancy', desc: 'Strict capacity per villa. All overnight guests must be registered.', color: 'text-[#103752]', bg: 'bg-slate-100' },
    { icon: Droplets, title: 'Swimming Pool', desc: 'Pool hours 8 AM – 10 PM. Children under 12 must be supervised.', color: 'text-[#FF7E5F]', bg: 'bg-[#FF7E5F]/10' },
    { icon: Music, title: 'Quiet Hours', desc: 'Quiet hours 10:30 PM – 8:00 AM. Residential neighbourhood — please be considerate.', color: 'text-[#FFB800]', bg: 'bg-[#FFB800]/10' },
  ];

  return (
    <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[#FFF9F5] rounded-3xl border border-orange-100/50 shadow-soft overflow-hidden">
        <div className="p-5 sm:p-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#ffdad2]/50 text-[#a53b22] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">Guest Guidelines</span>
              <h2 className="font-['Cormorant_Garamond',serif] text-xl sm:text-3xl font-bold text-[#1A2A2B]">House Rules</h2>
            </div>
            <button
              onClick={onNavigateToRules}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A2A2B] hover:bg-[#0f1818] text-white text-sm font-bold transition-all"
            >
              View All Rules
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {highlights.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100/80">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-['Cormorant_Garamond',serif] text-sm font-bold text-[#1A2A2B] mb-0.5">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            <button
              onClick={onNavigateToRules}
              className="flex items-center justify-center gap-2 bg-white rounded-xl p-4 border border-dashed border-slate-200 hover:border-[#FF7E5F] hover:bg-[#FF7E5F]/5 transition-all group cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-400 group-hover:text-[#FF7E5F] transition-colors">+9 More Rules</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF7E5F] transition-colors" />
            </button>
          </div>

          <button
            onClick={onNavigateToRules}
            className="sm:hidden w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1A2A2B] hover:bg-[#0f1818] text-white text-sm font-bold transition-all"
          >
            View All House Rules
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
