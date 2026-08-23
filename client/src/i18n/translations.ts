export type Language = 'en' | 'ms';

export interface TranslationDict {
  nav: {
    home: string;
    villas: string;
    about: string;
    stories: string;
    rules: string;
    contact: string;
    guestPortal: string;
    vipGuest: string;
    savedVillas: string;
    myStays: string;
    staysCount: string;
    staySingular: string;
    exploreDesc: string;
    villasDesc: string;
    aboutDesc: string;
    storiesDesc: string;
    rulesDesc: string;
    contactHost: string;
    whatsAppConcierge: string;
    language: string;
    switchLang: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titlePortDickson: string;
    tagline: string;
    bookDirectBadge: string;
    exploreBtn: string;
    contactBtn: string;
    savingsBadge: string;
  };
  common: {
    night: string;
    from: string;
    viewDetails: string;
    bookDirect: string;
    guests: string;
    bedrooms: string;
    bathrooms: string;
    reviews: string;
    verified: string;
    zeroPlatformFee: string;
    close: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    nav: {
      home: 'Home',
      villas: 'Our Villas',
      about: 'Port Dickson Guide',
      stories: 'Travel Stories',
      rules: 'House Rules',
      contact: 'Contact Us',
      guestPortal: 'VIP Guest Portal & Trips',
      vipGuest: 'VIP Guest',
      savedVillas: 'Wishlist',
      myStays: 'My Bookings',
      staysCount: 'Stays',
      staySingular: 'Stay',
      exploreDesc: 'Featured & Escapes',
      villasDesc: 'Our Villas Collection',
      aboutDesc: 'Beaches & Attractions',
      storiesDesc: 'Guides & Itineraries',
      rulesDesc: 'Policies & Guidelines',
      contactHost: 'Contact Host (Manager Jeff)',
      whatsAppConcierge: 'WhatsApp Concierge',
      language: 'Language',
      switchLang: 'Bahasa Melayu',
    },
    hero: {
      badge: 'Our Villas Direct Portal',
      titleStart: 'Balinese-Inspired Beach Villas in',
      titlePortDickson: 'Port Dickson',
      tagline: 'Direct booking for 5 authentic Balinese-inspired private pool & beachfront holiday villas across Teluk Kemang, Cape Rachado, and Blue Lagoon.',
      bookDirectBadge: 'Best Rate Guaranteed • 0% Platform Fee',
      exploreBtn: 'Explore Our Villas',
      contactBtn: 'WhatsApp Host (Jeff)',
      savingsBadge: 'Save ~18% vs OTAs',
    },
    common: {
      night: 'night',
      from: 'From',
      viewDetails: 'View Villa Details',
      bookDirect: 'Book Direct (0% Fee)',
      guests: 'guests',
      bedrooms: 'bedrooms',
      bathrooms: 'bathrooms',
      reviews: 'reviews',
      verified: '100% Verified',
      zeroPlatformFee: '0% Platform Fee',
      close: 'Close',
    },
  },
  ms: {
    nav: {
      home: 'Utama',
      villas: 'Koleksi Vila',
      about: 'Panduan PD',
      stories: 'Kisah & Jurnal',
      rules: 'Peraturan Rumah',
      contact: 'Hubungi Kami',
      guestPortal: 'Portal Tetamu VIP & Tempahan',
      vipGuest: 'Tetamu VIP',
      savedVillas: 'Disimpan',
      myStays: 'Tempahan Saya',
      staysCount: 'Tempahan',
      staySingular: 'Tempahan',
      exploreDesc: 'Pilihan & Percutian',
      villasDesc: 'Koleksi Vila Kami',
      aboutDesc: 'Pantai & Tarikan Menarik',
      storiesDesc: 'Panduan & Jadual Percutian',
      rulesDesc: 'Panduan & Polisi Penginapan',
      contactHost: 'Hubungi Pengurus (Jeff)',
      whatsAppConcierge: 'WhatsApp Khidmat Pelanggan',
      language: 'Bahasa',
      switchLang: 'English',
    },
    hero: {
      badge: 'Portal Tempahan Terus Vila Bali',
      titleStart: 'Vila Berkonsepkan Bali di',
      titlePortDickson: 'Port Dickson',
      tagline: 'Tempahan terus untuk 5 buah vila percutian berkonsepkan Bali eksklusif dengan kolam batu semula jadi & tepi pantai di Teluk Kemang, Cape Rachado, dan Blue Lagoon.',
      bookDirectBadge: 'Jaminan Harga Terbaik • 0% Caj Platform',
      exploreBtn: 'Lihat Vila Kami',
      contactBtn: 'WhatsApp Pengurus (Jeff)',
      savingsBadge: 'Jimat ~18% Berbanding OTA',
    },
    common: {
      night: 'malam',
      from: 'Daripada',
      viewDetails: 'Lihat Butiran Vila',
      bookDirect: 'Tempah Terus (0% Caj)',
      guests: 'tetamu',
      bedrooms: 'bilik tidur',
      bathrooms: 'bilik air',
      reviews: 'ulasan',
      verified: '100% Sah & Disahkan',
      zeroPlatformFee: '0% Caj Platform',
      close: 'Tutup',
    },
  },
};
