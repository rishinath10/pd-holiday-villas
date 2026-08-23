import React from 'react';
import { X, Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  maxPrice: number;
  setMaxPrice: (p: number) => void;
  minGuests: number;
  setMinGuests: (g: number) => void;
  onApply: () => void;
  onReset: () => void;
}

const CATEGORIES = ['all', 'Beachfront', 'Ocean View', 'Private Pool', 'Family Chalet', 'Romantic Escape'];

export const SearchFilterModal: React.FC<Props> = ({ isOpen, onClose, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, maxPrice, setMaxPrice, minGuests, setMinGuests, onApply, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#FFF9F5] rounded-3xl shadow-2xl overflow-hidden animate-modal-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-orange-100/50">
          <div className="flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-[#FF7E5F]" /><h2 className="font-['EB_Garamond',serif] text-xl font-bold">Search & Filter</h2></div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search villas, locations, amenities..." className="flex-1 text-sm bg-transparent outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === c ? 'bg-[#FF7E5F] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-[#FF7E5F]'}`}>
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Max Price: RM{maxPrice}/night</label>
            <input type="range" min={300} max={5000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#FF7E5F]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Min Guests: {minGuests}</label>
            <input type="range" min={1} max={12} value={minGuests} onChange={(e) => setMinGuests(Number(e.target.value))} className="w-full accent-[#2EB5B2]" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => { onReset(); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm transition-all hover:bg-slate-200">Reset</button>
            <button onClick={() => { onApply(); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-[#FF7E5F] hover:bg-[#a53b22] text-white font-bold text-sm transition-all">Apply Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
};
