
import React from 'react';
import { Chapter } from '../types';
import { triggerHaptic } from '../services/hapticService';

interface SurahCardProps {
  chapter: Chapter;
  onClick: (id: number) => void;
}

export const SurahCard: React.FC<SurahCardProps> = ({ chapter, onClick }) => {
  return (
    <button 
      onClick={() => {
        triggerHaptic('light');
        onClick(chapter.id);
      }}
      className="bg-white p-6 rounded-3xl border border-slate-200/60 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 group flex items-center w-full text-left relative overflow-hidden hover-lift"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors"></div>
      
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white font-extrabold transition-all duration-300 shadow-inner shrink-0 relative z-10">
        {chapter.id}
      </div>
      
      <div className="ml-5 flex-grow relative z-10">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
          {chapter.name_complex}
        </h3>
        <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
          {chapter.translated_name.name}
        </p>
        <div className="flex items-center space-x-2 mt-2">
           <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-emerald-300 transition-colors"></span>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{chapter.verses_count} Verses</span>
        </div>
      </div>

      <div className="text-right shrink-0 relative z-10">
        <p className="arabic-text text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
          {chapter.name_arabic}
        </p>
        <div className="flex items-center justify-end space-x-1 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
           <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v5.25H6a.75.75 0 000 1.5h6a.75.75 0 00.75-.75V6z" clipRule="evenodd" />
           </svg>
           <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
             {chapter.revelation_place}
           </span>
        </div>
      </div>
    </button>
  );
};
