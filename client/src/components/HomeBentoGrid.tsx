import React from 'react';
import { VillaCard } from './VillaCard';
import type { Villa } from '../types';

interface Props {
  villas: Villa[];
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
  onSelectVilla: (villa: Villa) => void;
  onBookDirect: (villa: Villa) => void;
  onNavigateTab: (tab: 'home' | 'villas' | 'about' | 'stories' | 'rules' | 'contact') => void;
  onOpenContact: () => void;
}

export const HomeBentoGrid: React.FC<Props> = ({ villas, favorites, onToggleFavorite, onSelectVilla, onBookDirect }) => {
  const featured = villas.slice(0, 3);

  return (
    <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center mb-6 sm:mb-8">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffdad2]/50 text-[#a53b22] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
          Balinese Architecture Collection
        </span>
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-4xl font-bold text-[#1A2A2B]">Featured Villas</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">Hand-picked Balinese-inspired coastal retreats featuring private stone pools, carved teakwood, and sunset vistas.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {featured.map((villa) => (
          <VillaCard
            key={villa.slug}
            villa={villa}
            isFavorite={favorites.includes(villa.slug)}
            onToggleFavorite={onToggleFavorite}
            onSelectVilla={onSelectVilla}
            onBookDirect={onBookDirect}
          />
        ))}
      </div>
    </section>
  );
};
