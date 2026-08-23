import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HomeBentoGrid } from './components/HomeBentoGrid';
import { GuestExperiencesSection } from './components/GuestExperiencesSection';
import { Footer } from './components/Footer';
import { VillaDetailModal } from './components/VillaDetailModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { SearchFilterModal } from './components/SearchFilterModal';
import { AboutPDView } from './components/AboutPDView';
import { OurStoriesView } from './components/OurStoriesView';
import { HouseRulesView } from './components/HouseRulesView';
import { ContactModal } from './components/ContactModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { VillasCatalogView } from './components/VillasCatalogView';
import { OTAChannelsCarousel } from './components/OTAChannelsCarousel';
import { HomeHouseRulesSection } from './components/HomeHouseRulesSection';
import { WeatherWidget } from './components/WeatherWidget';
import { CookieBanner } from './components/CookieBanner';
import { MobileStickyBookCTA } from './components/MobileStickyBookCTA';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsView } from './components/TermsView';
import { fetchVillas } from './api';
import { trackPageView, trackVillaView, trackBookingCompleted } from './lib/analytics';
import type { Villa, Booking } from './types';

const AdminDashboardModal = lazy(() => import('./components/AdminDashboardModal'));

const PAGE_TITLES: Record<string, string> = {
  home: 'PD Holiday Villas | Balinese Beach Villas in Port Dickson',
  villas: 'Our Villas | PD Holiday Villas',
  about: 'Port Dickson Guide | PD Holiday Villas',
  stories: 'Travel Stories | PD Holiday Villas',
  rules: 'House Rules | PD Holiday Villas',
  privacy: 'Privacy Policy | PD Holiday Villas',
  terms: 'Terms & Conditions | PD Holiday Villas',
};

// Crawlers read the description of whatever tab is active, so it has to move
// with the title rather than staying pinned to the homepage copy.
const PAGE_DESCRIPTIONS: Record<string, string> = {
  home: 'Book direct and save 18%. 5 authentic Balinese-inspired private pool & beachfront holiday villas in Port Dickson, Negeri Sembilan, Malaysia. 0% platform fee.',
  villas: 'Browse all 5 Balinese-inspired holiday villas in Port Dickson — private pools, beachfront access, sleeps 4 to 12. Direct rates from RM1200 per night.',
  about: 'A local guide to Port Dickson: Teluk Kemang, Cape Rachado, Blue Lagoon, beaches, food and things to do near our villas.',
  stories: 'Travel stories and guest experiences from our Balinese-inspired beach villas in Port Dickson.',
  rules: 'House rules for PD Holiday Villas — check-in times, pool safety, guest limits, and our cancellation policy.',
  privacy: 'How PD Holiday Villas collects, uses, and protects your personal data.',
  terms: 'Terms and conditions for booking a stay with PD Holiday Villas.',
};

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function App() {
  type TabKey = 'home' | 'villas' | 'about' | 'stories' | 'rules' | 'contact' | 'privacy' | 'terms';
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const navigateTo = (tab: string) => setActiveTab(tab as TabKey);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pd_villas_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minGuests, setMinGuests] = useState(1);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchVillas()
      .then(setVillas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const title = PAGE_TITLES[activeTab] || PAGE_TITLES.home;
    const description = PAGE_DESCRIPTIONS[activeTab] || PAGE_DESCRIPTIONS.home;

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    trackPageView(activeTab, title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try { localStorage.setItem('pd_villas_favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const handleOpenVillaDetail = (villa: Villa) => {
    setSelectedVilla(villa);
    setIsDetailModalOpen(true);
    trackVillaView(villa.slug, villa.title, villa.pricePerNight);
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setIsDetailModalOpen(false);
    setConfirmedBooking(booking);
    setIsConfirmModalOpen(true);

    const villa = typeof booking.villa === 'object' ? booking.villa : null;
    trackBookingCompleted(
      booking.bookingRef,
      villa?.slug ?? 'unknown',
      villa?.title ?? 'unknown',
      booking.totalPrice,
      booking.nights
    );
  };

  const filteredVillas = useMemo(() => {
    let result = villas.filter((villa) => {
      if (selectedCategory !== 'all' && villa.category !== selectedCategory) return false;
      if (villa.pricePerNight > maxPrice) return false;
      if (villa.sleepsCount < minGuests) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !villa.title.toLowerCase().includes(q) &&
          !villa.location.toLowerCase().includes(q) &&
          !villa.fullDescription.toLowerCase().includes(q) &&
          !villa.amenities.some((a) => a.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'capacity') result = [...result].sort((a, b) => b.sleepsCount - a.sleepsCount);

    return result;
  }, [villas, selectedCategory, maxPrice, minGuests, searchQuery, sortBy]);

  const favoriteVillasList = useMemo(() => villas.filter((v) => favorites.includes(v.slug)), [villas, favorites]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eafdff]">
        <div className="text-center space-y-5">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute -inset-2 rounded-2xl border-[3px] border-[#2EB5B2]/15 animate-ping" />
            <div className="absolute -inset-2 rounded-2xl border-[3px] border-transparent border-t-[#FF7E5F] border-r-[#2EB5B2] animate-spin" style={{ animationDuration: '1.2s' }} />
            <img src="/icon.png" alt="PD Holiday Villas" className="relative w-20 h-20 rounded-2xl shadow-xl object-contain" />
          </div>
          <div className="space-y-1">
            <p className="font-['EB_Garamond',serif] text-xl font-bold text-[#1A2A2B]">PD Holiday Villas</p>
            <p className="font-['Jost',sans-serif] text-sm text-[#1A2A2B]/50 font-medium">Discovering sunset villas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#eafdff] text-[#1A2A2B] font-['Jost',sans-serif] antialiased flex flex-col justify-between selection:bg-[#FF7E5F] selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        favoritesCount={favorites.length}
        openFavorites={() => setIsFavoritesOpen(true)}
        openSearchModal={() => setIsSearchModalOpen(true)}
        openContactModal={() => setIsContactModalOpen(true)}
        openBookingsModal={() => setIsBookingsModalOpen(true)}
        openAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      <main className="flex-1 w-full pt-16 sm:pt-[68px] pb-16 sm:pb-8">
        {activeTab === 'home' && (
          <div className="space-y-4 sm:space-y-5">
            <HeroSection
              villas={villas}
              onExploreVillas={() => setActiveTab('villas')}
              onOpenContact={() => setIsContactModalOpen(true)}
              onNavigateTab={navigateTo}
              onSelectVilla={handleOpenVillaDetail}
            />
            <WeatherWidget />
            <OTAChannelsCarousel />
            <HomeBentoGrid
              villas={villas}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectVilla={handleOpenVillaDetail}
              onBookDirect={handleOpenVillaDetail}
              onNavigateTab={navigateTo}
              onOpenContact={() => setIsContactModalOpen(true)}
            />
            <GuestExperiencesSection
              onSelectVilla={handleOpenVillaDetail}
              villas={villas}
            />
            <HomeHouseRulesSection onNavigateToRules={() => setActiveTab('rules')} />
          </div>
        )}

        {activeTab === 'villas' && (
          <VillasCatalogView
            villas={filteredVillas}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectVilla={handleOpenVillaDetail}
            onBookDirect={handleOpenVillaDetail}
          />
        )}

        {activeTab === 'about' && <AboutPDView />}
        {activeTab === 'stories' && <OurStoriesView />}
        {activeTab === 'rules' && (
          <HouseRulesView
            onOpenContact={() => setIsContactModalOpen(true)}
            onExploreVillas={() => setActiveTab('villas')}
          />
        )}
        {activeTab === 'privacy' && <PrivacyPolicyView />}
        {activeTab === 'terms' && <TermsView />}
      </main>

      <Footer
        onNavigateTab={navigateTo}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
      />

      {activeTab === 'home' && <MobileStickyBookCTA onExploreVillas={() => setActiveTab('villas')} />}

      <VillaDetailModal
        villa={selectedVilla}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isFavorite={selectedVilla ? favorites.includes(selectedVilla.slug) : false}
        onToggleFavorite={handleToggleFavorite}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <BookingConfirmationModal
        booking={confirmedBooking}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteVillas={favoriteVillasList}
        onRemoveFavorite={handleToggleFavorite}
        onSelectVilla={handleOpenVillaDetail}
      />

      <SearchFilterModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minGuests={minGuests}
        setMinGuests={setMinGuests}
        onApply={() => { if (activeTab !== 'villas') setActiveTab('villas'); }}
        onReset={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(5000); setMinGuests(1); }}
      />

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
      />

      <Suspense fallback={null}>
        {isAdminDashboardOpen && (
          <AdminDashboardModal
            isOpen={isAdminDashboardOpen}
            onClose={() => setIsAdminDashboardOpen(false)}
            villas={villas}
            onVillasChanged={setVillas}
          />
        )}
      </Suspense>

      <CookieBanner />
    </div>
  );
}
