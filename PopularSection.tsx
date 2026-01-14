
import React from 'react';

interface PopularSectionProps {
  onSurahClick: (id: number) => void;
  onSpecialClick: (topic: string) => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({ onSurahClick, onSpecialClick }) => {
  const popularSurahs = [
    { id: 67, name: '67. Al-Mulk' },
    { id: 18, name: '18. Al-Kahf' },
    { id: 36, name: '36. Ya-Sin' },
    { id: 2, name: 'Ayatul Kursi', isVerse: true },
    { id: 2, name: '2. Al-Baqarah 285-286', isVerse: true },
  ];

  const popularTopics = [
    { name: '40 Hadith of An-Nawawi', icon: '📜' },
    { name: 'Morning Adhkar', icon: '☀️' },
    { name: 'Dua for Guidance', icon: '🤲' },
    { name: 'Seerah: The Hijrah', icon: '🕋' },
  ];

  return (
    <div className="bg-[#111827] text-white py-8 px-6 md:px-10 rounded-[40px] mb-12 shadow-2xl overflow-hidden relative border border-white/5">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Popular Quick Access</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Chapters and Verses</h3>
          <div className="flex flex-wrap gap-3">
            {popularSurahs.map((item) => (
              <button
                key={item.name}
                onClick={() => item.isVerse ? onSpecialClick(item.name) : onSurahClick(item.id)}
                className="flex items-center space-x-2 bg-[#1F2937] hover:bg-emerald-600/20 hover:ring-1 hover:ring-emerald-500/50 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all group border border-white/5"
              >
                <span className="group-hover:text-emerald-400 transition-colors">{item.name}</span>
                <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Prophetic Wisdom & Supplication</h3>
          <div className="flex flex-wrap gap-3">
            {popularTopics.map((topic) => (
              <button
                key={topic.name}
                onClick={() => onSpecialClick(topic.name)}
                className="flex items-center space-x-2 bg-[#1F2937] hover:bg-indigo-600/20 hover:ring-1 hover:ring-indigo-500/50 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all group border border-white/5"
              >
                <span className="text-base">{topic.icon}</span>
                <span className="group-hover:text-indigo-300 transition-colors">{topic.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button 
          onClick={() => onSpecialClick('Quran Radio')}
          className="flex items-center space-x-3 text-gray-300 hover:text-emerald-400 transition-all font-bold text-sm bg-white/5 px-5 py-2 rounded-full hover:bg-white/10"
        >
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span>Listen to Live Quran Radio</span>
        </button>
        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          Continuous Recitation Stream
        </div>
      </div>
    </div>
  );
};
