import React from 'react';
import { Sparkles } from 'lucide-react';
import { VillaCard } from './VillaCard';
import type { Villa } from '../types';

interface Props {
  villas: Villa[];
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
  onSelectVilla: (villa: Villa) => void;
  onBookDirect: (villa: Villa) => void;
}

export const VillasCatalogView: React.FC<Props> = ({ villas, favorites, onToggleFavorite, onSelectVilla, onBookDirect }) => (
  <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-4 sm:pt-6">
    <div className="text-center mb-6 sm:mb-8">
      <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffdad2]/50 text-[#a53b22] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">Balinese Architecture Collection</span>
      <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-4xl font-bold text-[#1A2A2B]">Balinese Villas in Port Dickson</h2>
      <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">Showing all {villas.length} Balinese-inspired coastal retreats featuring private stone pools, carved teakwood, and sunset vistas.</p>
    </div>
    {villas.length === 0 ? (
      <div className="text-center py-16 space-y-3">
        <Sparkles className="w-12 h-12 text-[#FFB800] mx-auto" />
        <p className="text-slate-500 font-medium">No villas match your current filters.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {villas.map((villa) => (
          <VillaCard key={villa.slug} villa={villa} isFavorite={favorites.includes(villa.slug)} onToggleFavorite={onToggleFavorite} onSelectVilla={onSelectVilla} onBookDirect={onBookDirect} />
        ))}
      </div>
    )}
  </section>
);
