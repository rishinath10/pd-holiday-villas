import React, { useState } from 'react';
import { Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { STORIES_DATA } from '../data/guideData';

export const OurStoriesView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-4 sm:pt-6 space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffdad2]/50 text-[#a53b22] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">Travel Stories</span>
        <h2 className="font-['EB_Garamond',serif] text-2xl sm:text-4xl font-bold text-[#1A2A2B]">Stories & Guides</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">Insider guides, local food trails, and sunset stories from Port Dickson.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STORIES_DATA.map((story) => (
          <div key={story.id} className="bg-[#FFF9F5] rounded-2xl overflow-hidden border border-orange-100/50 shadow-soft flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={story.image} alt={story.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-[#1A2A2B]">{story.category}</div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-['EB_Garamond',serif] text-lg font-bold mb-2 leading-snug">{story.title}</h3>
              <p className="text-sm text-slate-600 mb-3 flex-1">{story.snippet}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{story.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{story.readTime}</span>
              </div>
              <button onClick={() => setExpandedId(expandedId === story.id ? null : story.id)} className="flex items-center gap-1 text-[#FF7E5F] text-sm font-bold hover:underline">
                {expandedId === story.id ? <><ChevronUp className="w-4 h-4" />Read less</> : <><ChevronDown className="w-4 h-4" />Read more</>}
              </button>
              {expandedId === story.id && (
                <div className="mt-3 space-y-2 text-sm text-slate-600 leading-relaxed border-t border-orange-100/50 pt-3">
                  {story.content.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
