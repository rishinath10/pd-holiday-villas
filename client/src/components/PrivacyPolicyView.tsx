import React, { useEffect } from 'react';

export const PrivacyPolicyView: React.FC = () => {
  useEffect(() => { document.title = 'Privacy Policy | PD Holiday Villas'; }, []);

  return (
    <div className="px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8 sm:py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
        <span className="inline-block px-3 py-1 rounded-full bg-[#def1f4] text-[#006a68] text-[10px] font-bold uppercase tracking-wider mb-4">Legal</span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-[#1A2A2B] mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: August 2026</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">1. Information We Collect</h2>
            <p>When you make a booking or enquiry, we collect your name, email address, phone number, and booking details. We do not collect financial information directly — payments are processed through secure third-party payment gateways.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">2. How We Use Your Information</h2>
            <p>Your information is used solely to process and manage your villa booking, communicate regarding your stay, respond to enquiries, and improve our services. We will never sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">3. Cookies</h2>
            <p>We use essential cookies to maintain site functionality and remember your preferences (such as language and favorites). We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect some site features.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All data is transmitted over HTTPS encryption. Access to personal data is restricted to authorised personnel only.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">5. Data Retention</h2>
            <p>Booking records are retained for a period of 2 years after check-out for legal and accounting purposes. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">6. Third-Party Services</h2>
            <p>Our site may link to third-party platforms (Airbnb, Booking.com, Agoda, WhatsApp). These services have their own privacy policies. We are not responsible for the practices of external sites.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:pdholidayvillas@gmail.com" className="text-[#2EB5B2] hover:underline">pdholidayvillas@gmail.com</a> or WhatsApp <a href="https://wa.me/60123552585" className="text-[#2EB5B2] hover:underline">+60 12-355 2585</a>.</p>
          </section>

          <section>
            <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1A2A2B] mb-2">8. Contact</h2>
            <p>PD Holiday Villas Sdn. Bhd.<br />Port Dickson, Negeri Sembilan, Malaysia<br />Email: pdholidayvillas@gmail.com<br />Phone: +60 12-355 2585</p>
          </section>
        </div>
      </div>
    </div>
  );
};
