import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, Clock, Volume2, Waves, Flame, Ban, Car,
  PhoneCall, AlertTriangle, CheckCircle2, XCircle, Search,
  Share2, MessageCircle, Sparkles, HeartHandshake, Info, FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onOpenContact?: () => void;
  onExploreVillas?: () => void;
}

export const HouseRulesView: React.FC<Props> = ({ onOpenContact, onExploreVillas }) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: language === 'ms' ? 'Semua Peraturan' : 'All Rules' },
    { id: 'checkin', label: language === 'ms' ? 'Daftar Masuk/Keluar' : 'Check-In/Out', icon: Clock },
    { id: 'deposit', label: language === 'ms' ? 'Deposit Keselamatan' : 'Security Deposit', icon: ShieldCheck },
    { id: 'noise', label: language === 'ms' ? 'Waktu Senyap' : 'Quiet Hours', icon: Volume2 },
    { id: 'pool', label: language === 'ms' ? 'Kolam & Pantai' : 'Pool & Beach', icon: Waves },
    { id: 'bbq', label: language === 'ms' ? 'BBQ & Dapur' : 'BBQ & Kitchen', icon: Flame },
    { id: 'smoking', label: language === 'ms' ? 'Bebas Asap & Haiwan' : 'Smoking & Pets', icon: Ban },
    { id: 'parking', label: language === 'ms' ? 'Tempat Letak Kereta' : 'Parking', icon: Car },
  ];

  const rulesList = [
    {
      id: 'checkin-hours',
      category: 'checkin',
      title: language === 'ms' ? 'Waktu Daftar Masuk & Daftar Keluar' : 'Check-In & Check-Out Schedule',
      subtitle: language === 'ms' ? 'Masa standard untuk persiapan pembersihan profesional' : 'Standard times allowing deep sanitization & linen prep',
      icon: Clock,
      color: 'teal',
      dos: [
        language === 'ms' ? 'Daftar Masuk: Bermula 3:00 PM' : 'Check-In: From 3:00 PM onwards',
        language === 'ms' ? 'Daftar Keluar: Sebelum 12:00 PM tengah hari' : 'Check-Out: By 12:00 PM sharp',
        language === 'ms' ? 'Maklumkan anggaran waktu tiba kepada Jeff sekurang-kurangnya 2 jam awal' : 'Notify Manager Jeff of your estimated arrival time 2 hours in advance'
      ],
      donts: [
        language === 'ms' ? 'Daftar keluar lewat tanpa kebenaran (caj RM 100/jam boleh dikenakan)' : 'Late check-out without prior host approval (RM 100/hr may apply)',
        language === 'ms' ? 'Meninggalkan kunci di luar pagar tanpa pengesahan' : 'Leaving keys unattended outside gate without host acknowledgement'
      ],
      note: language === 'ms'
        ? 'Daftar masuk awal atau daftar keluar lewat tertakluk kepada kekosongan jadual pembersihan.'
        : 'Early check-in or late check-out is subject to availability and schedule of our housekeeping team.'
    },
    {
      id: 'security-deposit',
      category: 'deposit',
      title: language === 'ms' ? 'Polisi Deposit Keselamatan (RM 500 / RM 1,000 mengikut vila)' : 'Refundable Security Deposit Policy (RM 500 / RM 1,000 by villa)',
      subtitle: language === 'ms' ? 'Dipulangkan sepenuhnya dalam masa 48 jam sekiranya tiada kerosakan' : '100% fully refundable within 48 hours upon inspection after check-out',
      icon: ShieldCheck,
      color: 'emerald',
      dos: [
        language === 'ms'
          ? 'Deposit: RM 1,000 (The Bay, Bella Vista, Sounds of the Sea) | RM 500 (Nuri & Bird\'s Nest)'
          : 'Deposit rate: RM 1,000 for The Bay, Bella Vista, Sounds of the Sea | RM 500 for Nuri & Bird\'s Nest',
        language === 'ms' ? 'Deposit dibayar secara pemindahan bank / FPX sebelum atau semasa penyerahan kunci' : 'Deposit is deposited via instant transfer / FPX before or during check-in key handover',
        language === 'ms' ? 'Dipulangkan sepenuhnya dalam masa 48 jam selepas pemeriksaan daftar keluar' : 'Refunded in full within 48 hours of check-out after housekeeping clearance',
        language === 'ms' ? 'Laporkan sebarang ketidaksempurnaan atau kerosakan sedia ada kepada Jeff semasa daftar masuk' : 'Report any pre-existing damages to Jeff immediately upon arrival'
      ],
      donts: [
        language === 'ms' ? 'Merosakkan perabot, linen katil, atau peralatan kolam dan elektrik' : 'Damaging furniture, staining linens permanently, or breaking pool equipment',
        language === 'ms' ? 'Mengambil sebarang tuala kolam atau barangan hiasan vila keluar' : 'Removing towels, art pieces, or villa inventory from premises'
      ],
      note: language === 'ms'
        ? 'Kadar deposit keselamatan kami ditetapkan secara telus: RM 1,000 (The Bay, Bella Vista, Sounds of the Sea) & RM 500 (Nuri & Bird\'s Nest). Dipulangkan dalam tempoh 48 jam selepas pemeriksaan.'
        : 'Transparent security deposit tiering: RM 1,000 (The Bay, Bella Vista, Sounds of the Sea) & RM 500 (Nuri & Bird\'s Nest). Fully refunded within 48 hours after inspection.'
    },
    {
      id: 'quiet-hours',
      category: 'noise',
      title: language === 'ms' ? 'Waktu Senyap & Hormati Kejiranan Pantai' : 'Quiet Hours & Community Harmony',
      subtitle: language === 'ms' ? 'Waktu senyap bermula 10:30 PM hingga 8:00 AM' : 'Quiet hours enforced strictly from 10:30 PM to 8:00 AM',
      icon: Volume2,
      color: 'orange',
      dos: [
        language === 'ms' ? 'Kekalkan paras audio sederhana di ruang tamu dan teres luar' : 'Keep conversations and music at a relaxing, ambient volume',
        language === 'ms' ? 'Pindahkan aktiviti ke dalam ruang tertutup selepas 10:30 malam' : 'Move gatherings indoors with doors closed after 10:30 PM',
        language === 'ms' ? 'Hormati ketenteraman penduduk dan tetamu vila bersebelahan' : 'Respect the peaceful coastal neighborhood atmosphere'
      ],
      donts: [
        language === 'ms' ? 'Penggunaan pembesar suara konsert luar atau sistem karaoke berkuasa tinggi selepas 10:30 PM' : 'High-decibel outdoor sound systems or loud karaoke after 10:30 PM',
        language === 'ms' ? 'Membuat bising melampau yang mengganggu kejiranan pantai' : 'Raucous parties that disturb coastal neighbors'
      ],
      note: language === 'ms'
        ? 'Port Dickson adalah destinasi santai. Kami mengalu-alukan perjumpaan keluarga yang ceria namun memohon kerjasama untuk ketenangan malam.'
        : 'Our villas are serene private sanctuaries for families and friends. Modest gathering music is welcome, but commercial partying is prohibited.'
    },
    {
      id: 'pool-beach',
      category: 'pool',
      title: language === 'ms' ? 'Keselamatan Kolam Renang & Akses Pantai' : 'Private Swimming Pool & Beach Safety',
      subtitle: language === 'ms' ? 'Kanak-kanak wajib dipantau orang dewasa sepanjang masa' : 'Strict adult supervision required for children at all times',
      icon: Waves,
      color: 'teal',
      dos: [
        language === 'ms' ? 'Bilas pasir di pili kaki luar sebelum masuk ke dalam rumah atau kolam' : 'Rinse off beach sand at designated outdoor wash taps before entering pool or villa',
        language === 'ms' ? 'Gunakan tuala kolam yang disediakan untuk aktiviti air' : 'Use the complimentary pool towels for swimming (keep white bath towels indoors)',
        language === 'ms' ? 'Pantau kanak-kanak tanpa henti apabila berada berdekatan air' : 'Ensure continuous adult supervision whenever minors are near pool area'
      ],
      donts: [
        language === 'ms' ? 'Dilarang terjun tiruk (kedalaman kolam adalah 1.2m)' : 'No diving (pool depth is calibrated at 1.2m for safety)',
        language === 'ms' ? 'Dilarang membawa gelas kaca atau botol minuman kaca ke dalam kolam' : 'No glass cups, glassware, or beer bottles inside or at the edge of the pool',
        language === 'ms' ? 'Dilarang berenang semasa hujan lebat atau ribut petir' : 'No swimming during heavy tropical rainstorms or lightning'
      ],
      note: language === 'ms'
        ? 'Kedalaman kolam adalah 1.2 meter. Tiada pengawal keselamatan bertugas; aktiviti mandi adalah atas tanggungjawab tetamu sendiri.'
        : 'Pool depth is 1.2m. There is no lifeguard on duty; guests swim at their own risk with parental guidance.'
    },
    {
      id: 'bbq-kitchen',
      category: 'bbq',
      title: language === 'ms' ? 'Penggunaan Set BBQ & Dapur Memasak' : 'BBQ Pergola & Gourmet Kitchen Guidelines',
      subtitle: language === 'ms' ? 'Peralatan memasak mesra-halal disediakan' : 'Fully equipped chef kitchen & outdoor charcoal BBQ pit',
      icon: Flame,
      color: 'orange',
      dos: [
        language === 'ms' ? 'Gunakan kawasan BBQ luaran yang ditetapkan untuk membakar' : 'Use only designated outdoor BBQ pergolas for grilling',
        language === 'ms' ? 'Padamkan semua bara arang sepenuhnya selepas selesai makan malam' : 'Extinguish all charcoal embers thoroughly with water after cooking',
        language === 'ms' ? 'Ikat beg sampah sisa makanan dan masukkan ke dalam tong berpenutup' : 'Bag food leftovers securely inside covered trash bins to avoid attracting wildlife'
      ],
      donts: [
        language === 'ms' ? 'Membakar BBQ di dalam ruang tamu bertutup atau balkoni atas' : 'Barbecuing indoors or on upper wooden balcony decks',
        language === 'ms' ? 'Membuang minyak masak terpakai ke dalam sinki (gunakan bekas buangan)' : 'Pouring cooking oil or grease down kitchen sinks',
        language === 'ms' ? 'Meninggalkan sisa makanan terbuka di luar semalaman (monyet/kucing liar)' : 'Leaving food unattended outdoors overnight'
      ],
      note: language === 'ms'
        ? 'Dapur kami dilengkapi periuk nasi, ketuhar gelombang mikro, peti sejuk besar, pinggan mangkuk, dan gril BBQ.'
        : 'We provide BBQ grill pits, microwave, large refrigerator, and dining ware. Charcoal and wire mesh are guest-provided or requested from Jeff.'
    },
    {
      id: 'smoking-pets',
      category: 'smoking',
      title: language === 'ms' ? 'Zon Bebas Asap & Polisi Haiwan Peliharaan' : '100% Smoke-Free Indoors & Pet Policy',
      subtitle: language === 'ms' ? 'Menjaga udara segar dan keselesaan tetamu seterusnya' : 'Preserving pristine indoor air quality & hypoallergenic linens',
      icon: Ban,
      color: 'red',
      dos: [
        language === 'ms' ? 'Merokok / vape HANYA dibenarkan di kawasan luar (taman & teres tepi pantai)' : 'Smoking & vaping permitted ONLY in outdoor gardens, terraces, and patio pergolas',
        language === 'ms' ? 'Gunakan bekas abu rokok (ashtray) yang disediakan dan buang dengan selamat' : 'Dispose of cigarette butts responsibly inside provided outdoor ashtrays',
        language === 'ms' ? 'Minta kebenaran terlebih dahulu daripada Jeff jika ingin membawa haiwan peliharaan terlatih' : 'Request written pre-approval from Manager Jeff for small well-trained pets'
      ],
      donts: [
        language === 'ms' ? 'Dilarang merokok, vape, atau menghisap shisha di dalam mana-mana bilik tidur atau ruang tamu' : 'STRICTLY NO smoking, vaping, or shisha anywhere inside the villa bedrooms or living room',
        language === 'ms' ? 'Denda pembersihan ozon udara RM 500 akan dikenakan jika dikesan bau asap di dalam rumah' : 'An automatic RM 500 deep-cleansing fee applies if indoor smoking is detected',
        language === 'ms' ? 'Dilarang membiarkan haiwan naik ke atas tilam, sofa, atau masuk ke dalam kolam renang' : 'No pets on beds, couches, or swimming in the pool'
      ],
      note: language === 'ms'
        ? 'Polisi ini bagi memastikan tetamu yang menghidap asma atau alergi dapat bercuti dengan selamat.'
        : 'This strict policy protects families with young infants and guests with respiratory allergies.'
    },
    {
      id: 'parking-visitors',
      category: 'parking',
      title: language === 'ms' ? 'Kapasiti Tempat Letak Kereta & Tetamu' : 'Gated Parking & Max Guest Capacity',
      subtitle: language === 'ms' ? 'Setiap vila mempunyai kawasan parkir berpagar selamat' : 'Secure on-premise private parking bays for multiple vehicles',
      icon: Car,
      color: 'teal',
      dos: [
        language === 'ms' ? 'Letak kenderaan di dalam petak berpagar vila anda (muat 2 hingga 4 buah kereta)' : 'Park within the gated compound perimeter of your reserved villa (fits 2–4 cars)',
        language === 'ms' ? 'Kunci pintu pagar utama pada waktu malam untuk keselamatan' : 'Lock the entrance gate at night for privacy and security',
        language === 'ms' ? 'Maklumkan sekiranya terdapat tetamu tambahan yang berkunjung pada waktu siang' : 'Inform Manager Jeff in advance if hosting daytime-only visitors'
      ],
      donts: [
        language === 'ms' ? 'Melebihi kapasiti tidur maksimum yang dipersetujui tanpa makluman' : 'Exceeding the confirmed maximum overnight guest headcount without consent',
        language === 'ms' ? 'Menghalang laluan keluar jiran atau pintu pagar vila lain' : 'Blocking shared neighborhood coastal driveways or neighboring gates'
      ],
      note: language === 'ms'
        ? 'Kapasiti setiap vila berkonsepkan Bali: The Bay Beachfront (8 pax), Bella Vista (10 pax), Sounds of the Sea (6 pax), Nuri Holiday Villa (12 pax), Bird\'s Nest (4 pax).'
        : 'Balinese villa capacities: The Bay Beachfront (8 pax), Bella Vista (10 pax), Sounds of the Sea (6 pax), Nuri Holiday Villa (12 pax), Bird\'s Nest (4 pax).'
    }
  ];

  const filteredRules = useMemo(() => {
    return rulesList.filter((rule) => {
      if (selectedCategory !== 'all' && rule.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = rule.title.toLowerCase().includes(q);
        const matchSub = rule.subtitle.toLowerCase().includes(q);
        const matchNote = rule.note.toLowerCase().includes(q);
        const matchDos = rule.dos.some(d => d.toLowerCase().includes(q));
        const matchDonts = rule.donts.some(d => d.toLowerCase().includes(q));
        return matchTitle || matchSub || matchNote || matchDos || matchDonts;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, language]);

  const handleShareRules = () => {
    const summaryText = `🏠 *PD Holiday Villas — House Rules & Guidelines Summary*
📍 Port Dickson, Negeri Sembilan

🕒 *Check-In*: From 3:00 PM | *Check-Out*: By 12:00 PM
🛡️ *Security Deposit*:
  • RM 1,000 for The Bay, Bella Vista, Sounds of the Sea
  • RM 500 for Nuri & Bird's Nest
  (100% refundable within 48 hours upon damage-free inspection)
🔇 *Quiet Hours*: 10:30 PM – 8:00 AM (Please respect coastal neighborhood)
🏊 *Pool*: Wash sand off before entering. No diving. Adult supervision required.
🍖 *BBQ*: Extinguish charcoal embers thoroughly. Keep food waste in sealed bins.
🚬 *Clean Air*: 100% Smoke-free indoors. Smoking in outdoor gardens only.
🚗 *Parking*: Gated private compound for 2-6 vehicles.

📞 *Manager Jeff*: +60 12-355 2585`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="px-3 sm:px-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in py-4">
      {/* Header Banner */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#1A2A2B] via-[#0f1d1e] to-[#2EB5B2]/40 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-teal-900/30"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF7E5F]/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
            <HeartHandshake className="w-4 h-4 text-[#FFECA8]" />
            <span>{language === 'ms' ? 'PANDUAN & PERATURAN VILA KAMI' : 'OUR VILLAS GUEST GUIDELINES & HOUSE RULES'}</span>
          </div>

          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            {language === 'ms' ? 'Peraturan Rumah & Panduan Penginapan' : 'House Rules & Guest Etiquette'}
          </h1>

          <p className="font-['Jost',sans-serif] text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-2xl">
            {language === 'ms'
              ? 'Panduan ringkas dan telus untuk memastikan percutian anda sekeluarga berjalan lancar, selamat, dan mengekalkan keindahan serta ketenangan vila tepi pantai Port Dickson.'
              : 'Our straightforward, transparent house rules designed to ensure a safe, tranquil, and delightful seaside vacation for you, your group, and our coastal neighborhood.'}
          </p>

          {/* Key Metric Highlights */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs font-semibold">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-white/70 text-[10.5px] uppercase font-bold">{language === 'ms' ? 'Daftar Masuk' : 'Check-In'}</span>
              <span className="text-base sm:text-lg font-bold text-white mt-0.5">3:00 PM</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-white/70 text-[10.5px] uppercase font-bold">{language === 'ms' ? 'Daftar Keluar' : 'Check-Out'}</span>
              <span className="text-base sm:text-lg font-bold text-white mt-0.5">12:00 PM</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-white/70 text-[10.5px] uppercase font-bold">{language === 'ms' ? 'Waktu Senyap' : 'Quiet Hours'}</span>
              <span className="text-base sm:text-lg font-bold text-[#FFECA8] mt-0.5">10:30 PM+</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col">
              <span className="text-white/70 text-[10.5px] uppercase font-bold">{language === 'ms' ? 'Deposit Keselamatan' : 'Security Deposit'}</span>
              <span className="text-sm sm:text-base font-bold text-emerald-300 mt-0.5">RM 500 / RM 1k</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShareRules}
              className="px-5 py-2.5 rounded-full bg-white text-[#1A2A2B] hover:bg-orange-50 font-['Jost',sans-serif] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 min-h-[42px]"
            >
              <Share2 className="w-4 h-4 text-[#FF7E5F]" />
              <span>{copied ? (language === 'ms' ? '✓ Disalin ke Papan Keratan!' : '✓ Copied to Clipboard!') : (language === 'ms' ? 'Salin Ringkasan untuk Rombongan' : 'Share Rules with Travel Group')}</span>
            </button>

            <a
              href="https://wa.me/60123552585?text=Hello%20Manager%20Jeff%2C%20I%20have%20a%20question%20regarding%20the%20House%20Rules%20at%20PD%20Holiday%20Villas."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#2EB5B2] hover:bg-[#006a68] text-white font-['Jost',sans-serif] text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 min-h-[42px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'ms' ? 'Tanya Jeff di WhatsApp' : 'Ask Jeff on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-teal-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 min-h-[38px] flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#FF7E5F] text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {cat.icon && <cat.icon className="w-3.5 h-3.5 shrink-0" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ms' ? 'Cari peraturan (cth. BBQ, Deposit)...' : 'Search rules (e.g., BBQ, Deposit)...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7E5F] focus:border-transparent min-h-[38px]"
          />
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredRules.map((rule) => {
          const IconComponent = rule.icon;
          return (
            <div
              key={rule.id}
              className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    rule.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    rule.color === 'orange' ? 'bg-orange-50 text-[#FF7E5F] border border-orange-200' :
                    rule.color === 'red' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-[#def1f4] text-[#006a68] border border-teal-200'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] leading-tight">
                      {rule.title}
                    </h3>
                    <p className="font-['Jost',sans-serif] text-xs text-slate-500 font-medium mt-0.5">
                      {rule.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'ms' ? 'Disyorkan & Dibenarkan' : 'Guidelines & Permitted'}</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {rule.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'ms' ? 'Dilarang & Perlu Dielakkan' : 'Strictly Prohibited'}</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {rule.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-rose-50/40 p-2 rounded-xl border border-rose-100/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {rule.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency & Host Direct Support Card */}
      <div className="bg-[#FFF9F5] rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#a53b22] text-[11px] font-bold uppercase">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'ms' ? 'Bantuan & Kecemasan 24/7' : '24/7 Guest Assistance & Care'}</span>
          </div>
          <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1A2A2B]">
            {language === 'ms' ? 'Perlukan Bantuan Semasa Menginap?' : 'Need Assistance During Your Stay?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {language === 'ms'
              ? 'Pengurus kami Jeff dan pasukan sentiasa bersedia di Port Dickson untuk membantu anda dengan urusan daftar masuk, cadangan makanan laut tempatan, atau sebarang bantuan teknikal.'
              : 'Our resident manager Jeff and on-site support crew are stationed in Port Dickson to assist with check-in keys, BBQ equipment, or local dining recommendations.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href="https://wa.me/60123552585?text=Hello%20Manager%20Jeff%2C%20I%20am%20at%20PD%20Holiday%20Villas%20and%20need%20some%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-['Jost',sans-serif] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[46px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Jeff (+60 12-355 2585)</span>
          </a>

          {onExploreVillas && (
            <button
              onClick={onExploreVillas}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FF7E5F] hover:bg-[#a53b22] text-white font-['Jost',sans-serif] text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <span>{language === 'ms' ? 'Lihat Vila Kami' : 'Explore Our Villas'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
