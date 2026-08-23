import React from 'react';
import { MessageCircle, Building2 } from 'lucide-react';

interface Props {
  onExploreVillas: () => void;
}

export const MobileStickyBookCTA: React.FC<Props> = ({ onExploreVillas }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-2 flex gap-2">
        <button
          onClick={onExploreVillas}
          className="flex-1 py-3 rounded-xl bg-[#FF7E5F] hover:bg-[#a53b22] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Building2 className="w-4 h-4" />
          Book Direct & Save
        </button>
        <a
          href="https://wa.me/60123552585"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="sr-only">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
