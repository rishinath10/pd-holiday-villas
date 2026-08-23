import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Villa from './models/Villa.js';
import AdminUser from './models/AdminUser.js';

const villasData = [
  {
    slug: 'the-bay-beachfront-villa',
    title: 'The Bay Beachfront Villa',
    tagline: 'Balinese open-pavilion beachfront sanctuary with natural Sukabumi stone pool, carved teakwood, and direct sand access.',
    category: 'Beachfront',
    badgeCategory: 'BALINESE BEACHFRONT',
    sleepsCount: 8,
    bedrooms: 4,
    bathrooms: 3,
    rating: 4.95,
    reviewsCount: 142,
    pricePerNight: 750,
    securityDeposit: 1000,
    images: [
      { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', alt: 'The Bay Beachfront Villa exterior with Balinese pavilion architecture and natural stone pool overlooking the beach' },
      { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', alt: 'Open-air teakwood living pavilion with carved pillars and ocean views' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', alt: 'Sukabumi green stone swimming pool surrounded by frangipani garden' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', alt: 'Sunset view from the villa veranda over Teluk Kemang beach' },
    ],
    location: 'Teluk Kemang (Batu 8), Port Dickson',
    distanceToBeach: 'Direct Beachfront (0m to sand)',
    description: 'Balinese-inspired beachfront sanctuary with natural stone pool, carved teakwood, and sunset vistas.',
    fullDescription: 'Perched directly along the golden sands of Teluk Kemang, The Bay Beachfront Villa is an authentic Balinese-inspired coastal masterpiece. Designed with open-concept Wantilan pavilions, solid hand-carved teakwood pillars, and a private natural Sukabumi green stone pool, this villa offers an immersive tropical island escape. Step straight from your frangipani-framed veranda onto the soft sand, or lounge on woven daybeds while watching the Malacca Strait golden sunset.',
    amenities: [
      'Direct Sandy Beach Doorstep (0m)', 'Balinese Sukabumi Stone Pool', 'Open-Air Teakwood Living Pavilion',
      'Frangipani Garden Outdoor Rain Shower', 'Sunset BBQ Bale Pergola', 'High-Speed Starlink Wi-Fi',
      'Fully Equipped Chef Kitchen', 'Air Conditioning & Ceiling Fans in All Suites',
      'Smart 65" 4K TV & Bluetooth Sound', 'Gated Balinese Compound Parking for 4 Cars',
    ],
    highlights: [
      'Authentic Balinese open-air architecture with carved teakwood',
      'True beachfront doorstep — step straight onto soft sand',
      'Natural volcanic Sukabumi green stone swimming pool',
      'Unobstructed 180° sunset views over Teluk Kemang',
    ],
    host: { name: 'Manager Jeff & Team', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', superhost: true, responseRate: '100% within 15 mins' },
    googleLink: 'https://share.google/crsa39KqjKUzSEXlT',
  },
  {
    slug: 'bella-vista-beachfront-villa',
    title: 'Bella Vista Beachfront Villa',
    tagline: 'Stately Balinese royal estate with carved timber Bale veranda, sea-facing stone pool, and expansive tropical lawns.',
    category: 'Beachfront',
    badgeCategory: 'BALINESE ESTATE',
    sleepsCount: 10,
    bedrooms: 5,
    bathrooms: 4,
    rating: 4.92,
    reviewsCount: 118,
    pricePerNight: 880,
    securityDeposit: 1000,
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', alt: 'Bella Vista Beachfront Villa grand exterior with Balinese estate architecture and tropical lawns' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', alt: 'Sea-facing private stone pool with sun loungers and ocean horizon views' },
      { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', alt: 'Grand open-air dining Bale with carved teakwood and Malacca Strait vista' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', alt: 'Lush tropical courtyard garden with heliconias and frangipani trees' },
    ],
    location: 'Pantai Cahaya Negeri, Port Dickson',
    distanceToBeach: 'Direct Beachfront (1 min walk)',
    description: 'Balinese royal estate featuring carved timber Bale veranda, sea-facing stone pool, and alfresco dining.',
    fullDescription: 'Bella Vista Beachfront Villa captures the grandeur of a Balinese royal coastal estate (Puri Agung). Set amidst lush heliconias, traveler palms, and fragrant frangipani trees, this expansive villa features hand-carved Balinese timber portals, a grand open-air dining Bale overlooking the Malacca Strait, and a large private stone pool with poolside sun loungers. Perfectly suited for large family gatherings and milestone reunions seeking serene Balinese hospitality.',
    amenities: [
      'Balinese Grand Dining Bale & Veranda', 'Private Swimming Pool with Sun Loungers',
      'Seaside Lawn for Yoga & Family Gatherings', 'Artisanal Carved Teakwood Furnishings',
      'Commercial Charcoal BBQ Grill Station', 'Full Kitchen with Dishwasher & Nespresso',
      'Starlink High-Speed WiFi', 'Indoor-Outdoor Flow with Tropical Courtyard',
      'Games Area with Mahjong & Board Games', 'Beach Towels, Kayaks & Lifejackets',
    ],
    highlights: [
      'Stately Balinese architectural estate with expansive beachfront lawns',
      'Traditional carved timber Bale for sunset banquets',
      'Lush private tropical garden compound with complete privacy',
      'Front row seat to Port Dickson golden sunsets',
    ],
    host: { name: 'Manager Jeff & Team', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', superhost: true, responseRate: '100% within 15 mins' },
    googleLink: 'https://share.google/y4ozl1ZTGuxrPnkS2',
  },
  {
    slug: 'sounds-of-the-sea-seafront-villa',
    title: 'Sounds of the Sea Seafront Villa',
    tagline: 'Cliffside Balinese Zen water sanctuary with natural stone plunge pool, timber meditation deck, and soothing ocean acoustics.',
    category: 'Ocean View',
    badgeCategory: 'BALINESE ZEN RETREAT',
    sleepsCount: 6,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.98,
    reviewsCount: 96,
    pricePerNight: 650,
    securityDeposit: 1000,
    images: [
      { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80', alt: 'Sounds of the Sea Seafront Villa cliffside exterior with ocean views and timber deck' },
      { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', alt: 'Natural river-stone plunge pool perched above the surf with sunset lighting' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', alt: 'Ironwood meditation deck facing the Malacca Strait turquoise waters' },
      { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', alt: 'Open-air master suite with natural soaking tub and bamboo accents' },
    ],
    location: 'Tanjung Tuan / Cape Rachado, Port Dickson',
    distanceToBeach: 'Elevated Seafront (Overlooking Waves)',
    description: 'Cliffside Balinese Zen retreat with natural stone plunge pool, timber deck, and wave acoustics.',
    fullDescription: 'Perched on the tranquil cliffs of Cape Rachado overlooking turquoise waters, Sounds of the Sea Seafront Villa is a Balinese Zen water sanctuary (Tirta Retreat). Built with warm ironwood decking, volcanic river-stone accents, and an open-air plunge pool perched above the surf, the villa immerses guests in the therapeutic cadence of rolling tides and ocean breezes. Features an open-air soaking tub and handcrafted bamboo acoustics.',
    amenities: [
      'Balinese River-Stone Sunset Plunge Pool', 'Acoustic Wave-Facing Timber Sun Deck',
      'Open-Air Master Suite with Natural Soaking Tub', 'Handcrafted Bamboo & Teakwood Accents',
      'Marshall Multi-Room Sound System', 'Fully Equipped Gourmet Kitchenette',
      'High-Speed Wi-Fi & Coastal Workstation', 'Private Deck BBQ Setup',
      'Complimentary Sunset Welcome Herbal Infusion',
    ],
    highlights: [
      'Therapeutic Balinese Zen ambiance with natural wave acoustics',
      'Private cliffside natural stone plunge pool',
      'Breathtaking elevated 180° vantage point over Malacca Strait',
      'Walking distance to Cape Rachado forest & lighthouse trails',
    ],
    host: { name: 'Manager Jeff & Team', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', superhost: true, responseRate: '100% within 15 mins' },
    googleLink: 'https://share.google/GGRDMeT6guAMnzo8j',
  },
  {
    slug: 'nuri-holiday-villa',
    title: 'Nuri Balinese Holiday Villa',
    tagline: 'Expansive Balinese Joglo family estate featuring soaring timber ceilings, tranquil water features, large pool, and shaded BBQ Bale.',
    category: 'Family Chalet',
    badgeCategory: 'BALINESE JOGLO ESTATE',
    sleepsCount: 12,
    bedrooms: 5,
    bathrooms: 4,
    rating: 4.89,
    reviewsCount: 135,
    pricePerNight: 920,
    securityDeposit: 500,
    images: [
      { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', alt: 'Nuri Balinese Holiday Villa aerial view showing Joglo estate with large pool and tropical gardens' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', alt: 'Vaulted timber Joglo living pavilion with exposed trusswork and traditional architecture' },
      { url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80', alt: 'Large private swimming pool with children wading deck and poolside sun loungers' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', alt: 'Shaded BBQ Bale dining pavilion with 16-pax solid teak banquet table' },
    ],
    location: 'Pantai Saujana (Batu 4), Port Dickson',
    distanceToBeach: '3 mins walk (300m to beach)',
    description: 'Balinese Joglo family estate with vaulted timber lounge, large pool, koi pond, and BBQ Bale.',
    fullDescription: 'Nuri Balinese Holiday Villa is an extraordinary multi-generational family compound inspired by traditional Balinese Joglo architecture. Central to the estate is a magnificent open-plan living pavilion with soaring exposed timber trusswork, a soothing koi fish pond with stepping stones, and a huge private swimming pool featuring a dedicated children\'s wading deck. The shaded outdoor dining Bale seats 16 guests around a solid rain-tree banquet table.',
    amenities: [
      'Traditional Balinese Joglo Timber Living Lounge', 'Large Private Swimming Pool with Kids Wading Deck',
      'Tranquil Koi Pond & Tropical Stepping Stones', 'Shaded BBQ Bale with 16-Pax Solid Teak Dining Table',
      '5 Air-Conditioned Themed Balinese Suites', 'Modern Gourmet Kitchen & Large Breakfast Bar',
      'Karaoke & Smart Entertainment Hub', 'Gated Compound with Space for 6 Cars',
      'High-Speed Fiber Wi-Fi & Board Games', 'Complimentary Pool Inflatables & Beach Gear',
    ],
    highlights: [
      'Authentic Balinese Joglo architecture with soaring vaulted roofs',
      'Comfortably accommodates up to 12-16 family members',
      'Lush gated tropical garden with total privacy and water features',
      'Convenient 3-minute stroll to Pantai Saujana beach',
    ],
    host: { name: 'Manager Jeff & Team', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', superhost: true, responseRate: '100% within 15 mins' },
    googleLink: 'https://share.google/SurAFAtjHWfm6VgzW',
  },
  {
    slug: 'birds-nest-holiday-villa',
    title: "Bird's Nest Balinese Villa",
    tagline: 'Romantic Balinese Lumbung-inspired sanctuary near Blue Lagoon with private stone dipping pool, outdoor rain shower, and daybed.',
    category: 'Romantic Escape',
    badgeCategory: 'BALINESE ROMANTIC RETREAT',
    sleepsCount: 4,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.96,
    reviewsCount: 84,
    pricePerNight: 480,
    securityDeposit: 500,
    images: [
      { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', alt: "Bird's Nest Balinese Villa romantic exterior surrounded by bamboo and frangipani gardens" },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', alt: 'Private volcanic stone dipping pool nestled in tropical garden courtyard' },
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', alt: 'Open-air garden rainfall shower enclosed in bamboo with tropical plants' },
      { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80', alt: 'Hand-carved Balinese Bale Bengong daybed overlooking Blue Lagoon cove' },
    ],
    location: 'Blue Lagoon (Tanjung Biru), Port Dickson',
    distanceToBeach: '2 mins walk to Blue Lagoon Beach',
    description: 'Romantic Balinese Lumbung-inspired oasis with private stone dipping pool, outdoor rain shower, and daybeds.',
    fullDescription: "Tucked away near the crystal-clear cove of Blue Lagoon, Bird's Nest Balinese Villa is an intimate romantic hideaway inspired by Balinese Lumbung architecture. Surrounded by lush bamboo, vibrant frangipani blossoms, and visiting songbirds, this enchanting sanctuary features a secluded natural stone dipping pool, an open-air garden rain shower, and a hand-carved Balinese Bale Bengong daybed for lazy afternoons.",
    amenities: [
      'Private Balinese Volcanic Stone Dipping Pool', 'Open-Air Garden Rainfall Shower Enclosed in Bamboo',
      'Hand-Carved Balinese Bale Bengong Daybed & Hammock', 'Curated Reading Nook & Artisan Tea Station',
      'Modern Kitchenette with Espresso Machine', 'High-Speed Fiber Wi-Fi & Smart TV',
      'Private Garden BBQ Grill Setup', 'Complimentary Bicycle Rentals & Snorkel Gear',
    ],
    highlights: [
      'Intimate Balinese Lumbung design crafted for couples & small families',
      'Secluded volcanic stone plunge pool and garden rain shower',
      'Only 2 minutes walk to the calm swimming waters of Blue Lagoon',
      'Peaceful avian nature surroundings and coastal tranquility',
    ],
    host: { name: 'Manager Jeff & Team', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80', superhost: true, responseRate: '100% within 15 mins' },
    googleLink: 'https://share.google/MgLkQltk4h2BHs6Pd',
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // Seed villas
  for (const data of villasData) {
    const existing = await Villa.findOne({ slug: data.slug });
    if (existing) {
      console.log(`Villa "${data.title}" already exists, skipping.`);
      continue;
    }

    await Villa.create({
      ...data,
      icalImportUrls: [],
      icalExportToken: crypto.randomBytes(24).toString('hex'),
    });
    console.log(`Seeded villa: ${data.title}`);
  }

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pdholidayvillas.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  const existingAdmin = await AdminUser.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await AdminUser.create({
      email: adminEmail,
      passwordHash,
      name: 'Manager Jeff',
      role: 'admin',
      oauthProviders: [],
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
