import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('pd_cookie_consent')) setVisible(true);
    } catch { setVisible(true); }
  }, []);

  const accept = () => {
    try { localStorage.setItem('pd_cookie_consent', 'accepted'); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[45] p-3 sm:p-4 animate-modal-slide-up">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-slate-600 flex-1 leading-relaxed">
          We use essential cookies to keep the site running and remember your preferences. No tracking or advertising cookies are used.
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={accept} className="px-5 py-2 rounded-full bg-[#FF7E5F] hover:bg-[#a53b22] text-white text-sm font-bold transition-colors">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
