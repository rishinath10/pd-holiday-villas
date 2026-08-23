import React, { useEffect } from 'react';
import { ShieldCheck, Building2, Clock, BadgePercent, MapPin, Mail, MessageCircle, Waves } from 'lucide-react';

/**
 * Company registration details.
 *
 * Fill these in from the SSM certificate. Each row is omitted entirely while
 * its value is empty, so an unfilled field never ships as a visible blank or
 * placeholder text on a live page.
 */
const COMPANY = {
  registeredName: 'PD Holiday Villas Sdn. Bhd.',
  ssmNumber: '',        // e.g. '202001012345 (1234567-A)'
  registeredAddress: '', // e.g. 'No. 1, Jalan ..., 71050 Port Dickson, Negeri Sembilan'
  incorporated: '2020',
  email: 'pdholidayvillas@gmail.com',
  phone: '+60 12-355 2585',
  phoneHref: 'https://wa.me/60123552585',
};

const STATS = [
  { icon: Building2, value: '5', label: 'Private villas' },
  { icon: ShieldCheck, value: 'Since 2020', label: 'SSM registered' },
  { icon: Clock, value: '15 min', label: 'Typical reply' },
  { icon: BadgePercent, value: '0%', label: 'Booking fee' },
];

export const AboutUsView: React.FC = () => {
  useEffect(() => { document.title = 'About Us | PD Holiday Villas'; }, []);

  return (
    <div className="px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8 sm:py-12 space-y-6">

      {/* Intro */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
        <span className="inline-block px-3 py-1 rounded-full bg-[#def1f4] text-[#006a68] text-[10px] font-bold uppercase tracking-wider mb-4">
          About Us
        </span>
        <h1 className="font-['EB_Garamond',serif] text-3xl sm:text-4xl font-bold text-[#1A2A2B] mb-4">
          {COMPANY.registeredName}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          We are a Malaysian private limited company, registered with the Companies Commission
          of Malaysia (SSM) since {COMPANY.incorporated}, operating five privately owned holiday
          villas along the Port Dickson coastline. Every villa is booked, managed, and hosted by
          us directly — there is no agency in between.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-[#FFF9F5] rounded-2xl p-3.5 border border-orange-100/60">
              <Icon className="w-4 h-4 text-[#FF7E5F] mb-1.5" />
              <div className="font-['EB_Garamond',serif] text-lg font-bold text-[#1A2A2B] leading-tight">{value}</div>
              <div className="text-[11px] text-slate-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our story */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
        <h2 className="font-['EB_Garamond',serif] text-2xl font-bold text-[#1A2A2B] mb-5">Our Story</h2>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            PD Holiday Villas was incorporated in {COMPANY.incorporated} with a straightforward
            ambition: to offer Port Dickson a standard of villa accommodation that the town did
            not yet have. Not hotel rooms, and not ordinary homestays — genuinely luxurious
            private villas, each with its own pool, built for families who want the whole place
            to themselves.
          </p>
          <p>
            That shaped how the villas were designed. Each one takes its cues from Balinese
            resort architecture: pools finished in volcanic Sukabumi stone, hand-carved teakwood
            pavilions, open-air living that suits the coastal climate rather than fighting it.
            The result is five distinct properties across{' '}
            <strong className="text-[#1A2A2B] font-semibold">Teluk Kemang</strong>,{' '}
            <strong className="text-[#1A2A2B] font-semibold">Pantai Cahaya Negeri</strong>, and{' '}
            <strong className="text-[#1A2A2B] font-semibold">Tanjung Tuan</strong> — from
            Bird&rsquo;s Nest, an intimate retreat for four, up to The Bay, a beachfront estate
            built for large family gatherings.
          </p>
          <p>
            We host every stay ourselves. Manager Jeff and the team handle enquiries directly,
            typically replying within fifteen minutes, and are on hand throughout your stay.
            When you book with us you are speaking to the people who actually run the villas,
            which is the part no listing platform can pass on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
          {[
            { icon: Waves, title: 'Balinese-inspired', body: 'Sukabumi stone pools and hand-carved teakwood, designed for the coast.' },
            { icon: Building2, title: 'Privately owned', body: 'Five villas, all operated by us — never sub-let or agency-managed.' },
            { icon: ShieldCheck, title: 'A registered company', body: 'An SSM-registered Sdn. Bhd., accountable under Malaysian law.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-[#eafdff] rounded-2xl p-4 border border-[#2EB5B2]/15">
              <Icon className="w-4 h-4 text-[#006a68] mb-2" />
              <h3 className="font-bold text-sm text-[#1A2A2B] mb-1">{title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why book direct */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
        <h2 className="font-['EB_Garamond',serif] text-2xl font-bold text-[#1A2A2B] mb-3">Why Book Direct</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Our villas are listed on Airbnb, Booking.com, and Agoda, and you are welcome to book
          through any of them. But those platforms add commission and service fees of roughly
          18% — money that goes to the platform, not into your stay. Booking on this site skips
          that entirely.
        </p>

        <div className="bg-gradient-to-br from-[#FFF9F5] to-[#ffdad2]/40 rounded-2xl p-5 border border-orange-100/70 mb-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Via a platform</div>
              <div className="font-['EB_Garamond',serif] text-xl font-bold text-slate-400 line-through">+18%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">in added fees</div>
            </div>
            <div className="border-x border-orange-200/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Booking here</div>
              <div className="font-['EB_Garamond',serif] text-xl font-bold text-[#a53b22]">0%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">platform fee</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">On a 2-night stay</div>
              <div className="font-['EB_Garamond',serif] text-xl font-bold text-[#006a68]">RM430+</div>
              <div className="text-[11px] text-slate-500 mt-0.5">typically saved</div>
            </div>
          </div>
        </div>

        <ul className="space-y-2.5 text-sm text-slate-600">
          {[
            'The same villa, the same dates, without the platform’s commission added on top.',
            'You deal with us directly — no support ticket, no intermediary relaying messages.',
            'Flexibility on check-in times, extra guests, and special requests, decided by us rather than a platform’s rulebook.',
            'Your booking reference and payment are arranged with us, so anything that needs changing can simply be changed.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#2EB5B2] shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Company details */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
        <h2 className="font-['EB_Garamond',serif] text-2xl font-bold text-[#1A2A2B] mb-5">Company Details</h2>

        <dl className="divide-y divide-slate-100 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
            <dt className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Registered name</dt>
            <dd className="sm:col-span-2 text-[#1A2A2B] font-medium">{COMPANY.registeredName}</dd>
          </div>

          {COMPANY.ssmNumber && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
              <dt className="text-slate-400 font-semibold text-xs uppercase tracking-wider">SSM registration</dt>
              <dd className="sm:col-span-2 text-[#1A2A2B] font-medium">{COMPANY.ssmNumber}</dd>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
            <dt className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Incorporated</dt>
            <dd className="sm:col-span-2 text-[#1A2A2B] font-medium">{COMPANY.incorporated}</dd>
          </div>

          {COMPANY.registeredAddress && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
              <dt className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Registered address</dt>
              <dd className="sm:col-span-2 text-[#1A2A2B] font-medium">{COMPANY.registeredAddress}</dd>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
            <dt className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Operating area</dt>
            <dd className="sm:col-span-2 text-[#1A2A2B] font-medium flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF7E5F] shrink-0 mt-0.5" />
              Port Dickson, Negeri Sembilan, Malaysia
            </dd>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
            <dt className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Contact</dt>
            <dd className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <a href={`mailto:${COMPANY.email}`} className="text-[#2EB5B2] hover:underline flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5" />{COMPANY.email}
              </a>
              <a href={COMPANY.phoneHref} target="_blank" rel="noopener noreferrer" className="text-[#2EB5B2] hover:underline flex items-center gap-1.5 font-medium">
                <MessageCircle className="w-3.5 h-3.5" />{COMPANY.phone}
              </a>
            </dd>
          </div>
        </dl>
      </div>

    </div>
  );
};
