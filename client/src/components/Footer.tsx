import React from 'react';
import { Home, Building2, Compass, BookOpen, ScrollText, MessageCircle, Heart, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onNavigateTab: (tab: string) => void;
  onOpenContact: () => void;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigateTab, onOpenContact, onOpenFavorites, onOpenAdmin }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-[#1A2A2B] via-[#1a2a2b] to-[#0f1818] text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo-sm.png" alt="PD Holiday Villas logo" className="w-10 h-10 rounded-xl shadow-md object-contain" />
              <div>
                <span className="font-['EB_Garamond',serif] text-base font-bold tracking-tight block">PD HOLIDAY</span>
                <span className="font-['Dancing_Script',cursive] text-sm text-[#2EB5B2]">Villas</span>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">5 Balinese-inspired private pool & beachfront holiday villas in Port Dickson, Negeri Sembilan.</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Explore</h4>
            <div className="space-y-2">
              {[
                { label: t.nav.home, icon: Home, tab: 'home' },
                { label: t.nav.villas, icon: Building2, tab: 'villas' },
                { label: t.nav.about, icon: Compass, tab: 'about' },
              ].map(({ label, icon: Icon, tab }) => (
                <button key={tab} onClick={() => onNavigateTab(tab)} className="flex items-center gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors w-full text-left">
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Resources</h4>
            <div className="space-y-2">
              {[
                { label: t.nav.stories, icon: BookOpen, action: () => onNavigateTab('stories') },
                { label: t.nav.rules, icon: ScrollText, action: () => onNavigateTab('rules') },
                { label: t.nav.savedVillas, icon: Heart, action: onOpenFavorites },
              ].map(({ label, icon: Icon, action }) => (
                <button key={label} onClick={action} className="flex items-center gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors w-full text-left">
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">Contact & Legal</h4>
            <div className="space-y-2">
              <button onClick={onOpenContact} className="flex items-center gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors"><MessageCircle className="w-3.5 h-3.5" />{t.nav.contact}</button>
              <button onClick={() => onNavigateTab('aboutus')} className="flex items-center gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors"><Building2 className="w-3.5 h-3.5" />About Us</button>
              <button onClick={() => onNavigateTab('privacy')} className="flex items-center gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors"><Shield className="w-3.5 h-3.5" />Privacy Policy</button>
              <button onClick={() => onNavigateTab('terms')} className="flex items-center gap-2 py-1.5 text-sm text-white/70 hover:text-white transition-colors"><ScrollText className="w-3.5 h-3.5" />Terms & Conditions</button>
              <button onClick={onOpenAdmin} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors text-[11px]"><Shield className="w-3 h-3" />Admin</button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>PD Holiday Villas Sdn. Bhd. &copy; {new Date().getFullYear()}</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigateTab('privacy')} className="hover:text-white/70 transition-colors">Privacy</button>
            <button onClick={() => onNavigateTab('terms')} className="hover:text-white/70 transition-colors">Terms</button>
            <span>0% Direct Booking Fee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
