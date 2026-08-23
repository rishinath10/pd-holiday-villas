import React from 'react';
import { X, Heart, Star, MapPin } from 'lucide-react';
import { useModal } from '../hooks/useModal';
import type { Villa } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  favoriteVillas: Villa[];
  onRemoveFavorite: (slug: string) => void;
  onSelectVilla: (villa: Villa) => void;
}

export const FavoritesDrawer: React.FC<Props> = ({ isOpen, onClose, favoriteVillas, onRemoveFavorite, onSelectVilla }) => {
  useModal(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Saved villas">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#FFF9F5] shadow-2xl animate-slide-left flex flex-col h-full">
        <div className="flex items-center justify-between p-5 border-b border-orange-100/50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#FF7E5F]" />
            <h2 className="font-['EB_Garamond',serif] text-xl font-bold">Saved Villas</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {favoriteVillas.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-slate-200 mx-auto" />
              <p className="text-slate-400 text-sm">No saved villas yet.</p>
            </div>
          ) : (
            favoriteVillas.map((v) => (
              <div key={v.slug} className="bg-white rounded-2xl p-3 border border-orange-100/50 shadow-soft flex gap-3">
                <img src={v.images[0]?.url} alt={v.images[0]?.alt || v.title} referrerPolicy="no-referrer" loading="lazy" decoding="async" onClick={() => onSelectVilla(v)} className="w-20 h-20 rounded-xl object-cover cursor-pointer shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 onClick={() => onSelectVilla(v)} className="font-bold text-sm cursor-pointer hover:text-[#FF7E5F] truncate">{v.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{v.location}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-bold text-sm">RM{v.pricePerNight}</span>
                    <span className="text-xs text-slate-400">/night</span>
                    <div className="ml-auto flex items-center gap-0.5 text-xs"><Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />{v.rating}</div>
                  </div>
                </div>
                <button onClick={() => onRemoveFavorite(v.slug)} className="self-start p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
