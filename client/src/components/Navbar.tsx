import React, { useState } from 'react';
import { Home, Building2, ScrollText, MessageCircle, Heart, CalendarDays, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  favoritesCount: number;
  openFavorites: () => void;
  openSearchModal: () => void;
  openContactModal: () => void;
  openBookingsModal: () => void;
  openAdminDashboard: () => void;
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, favoritesCount, openFavorites, openSearchModal, openContactModal, openBookingsModal }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: t.nav.home, icon: Home },
    { key: 'villas', label: t.nav.villas, icon: Building2 },
    { key: 'rules', label: t.nav.rules, icon: ScrollText },
  ] as const;

  return (
    <nav className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto glass-pill rounded-2xl shadow-soft border border-white/40 px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <button onClick={() => setActiveTab('home')} className="shrink-0">
          <img src="/PDHV logo png.png" alt="PD Holiday Villas" className="h-9 sm:h-11 w-auto object-contain" />
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key as any)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === key ? 'bg-[#FF7E5F] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Toggle Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-0.5 h-7 rounded-full bg-slate-100 border border-slate-200 px-0.5 transition-colors hover:bg-slate-200"
            title={t.nav.switchLang}
          >
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-[#FF7E5F] text-white shadow-sm' : 'text-slate-500'}`}>EN</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'ms' ? 'bg-[#FF7E5F] text-white shadow-sm' : 'text-slate-500'}`}>BM</span>
          </button>
          <button onClick={openFavorites} className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <Heart className="w-4 h-4" />
            {favoritesCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF7E5F] text-white text-[9px] font-bold flex items-center justify-center">{favoritesCount}</span>}
          </button>
          <button onClick={openBookingsModal} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500" title="My Bookings"><CalendarDays className="w-4 h-4" /></button>
          <button onClick={openContactModal} className="hidden sm:flex p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"><MessageCircle className="w-4 h-4" /></button>

          {/* Mobile Menu */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto glass-pill rounded-2xl shadow-soft border border-white/40 p-3 animate-modal-slide-up">
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { setActiveTab(key as any); setMobileMenuOpen(false); }} className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === key ? 'bg-[#FF7E5F] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
            <button onClick={() => { openContactModal(); setMobileMenuOpen(false); }} className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />{t.nav.contact}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
