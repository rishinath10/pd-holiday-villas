import React, { useEffect } from 'react';

export const TermsView: React.FC = () => {
  useEffect(() => { document.title = 'Terms & Conditions | PD Holiday Villas'; }, []);

  return (
    <div className="px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8 sm:py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
        <span className="inline-block px-3 py-1 rounded-full bg-[#def1f4] text-[#006a68] text-[10px] font-bold uppercase tracking-wider mb-4">Legal</span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-[#1A2A2B] mb-6">Terms & Conditions</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">1. Booking & Confirmation</h2>
            <p>All bookings are subject to availability. A booking is confirmed only after full payment is received and a confirmation email is sent. Booking references are provided for all confirmed reservations.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">2. Check-in & Check-out</h2>
            <p>Check-in time is from 3:00 PM. Check-out time is by 12:00 PM (noon). Early check-in or late check-out may be arranged subject to availability and may incur additional charges. Please contact us in advance to arrange.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">3. Security Deposit</h2>
            <p>A refundable security deposit is required for each booking: RM 1,000 for The Bay, Bella Vista, and Sounds of the Sea; RM 500 for Nuri and Bird's Nest. The deposit is refundable within 3 business days after check-out, subject to property inspection.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">4. Cancellation Policy</h2>
            <p>Cancellations made 14 or more days before check-in receive a full refund. Cancellations 7–13 days before check-in receive a 50% refund. Cancellations less than 7 days before check-in are non-refundable. No-shows are non-refundable.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">5. Guest Responsibilities</h2>
            <p>Guests are responsible for adhering to house rules, maintaining the property in good condition, and reporting any damages immediately. The number of guests must not exceed the maximum occupancy of the booked villa. All overnight guests must be registered at the time of booking.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">6. Liability</h2>
            <p>PD Holiday Villas Sdn. Bhd. is not liable for personal injury, loss, or damage to guests' property during their stay. Guests use all facilities, including swimming pools, at their own risk. Children under 12 must be supervised by an adult at all times in pool areas.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">7. Pricing</h2>
            <p>All prices are quoted in Malaysian Ringgit (RM) and are inclusive of applicable taxes unless otherwise stated. Prices may vary based on season, day of week, and special events. Direct booking guarantees the best available rate with 0% platform fees.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">8. Contact</h2>
            <p>For enquiries, please contact:<br />PD Holiday Villas Sdn. Bhd.<br />Email: <a href="mailto:pdholidayvillas@gmail.com" className="text-[#2EB5B2] hover:underline">pdholidayvillas@gmail.com</a><br />WhatsApp: <a href="https://wa.me/60123552585" className="text-[#2EB5B2] hover:underline">+60 12-355 2585</a></p>
          </section>
        </div>
      </div>
    </div>
  );
};
