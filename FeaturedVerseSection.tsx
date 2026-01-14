
import React, { useState } from 'react';
import { Verse, Chapter } from '../types';
import { triggerHaptic } from '../services/hapticService';

interface FeaturedVerseSectionProps {
  dayVerse: { verse: Verse; chapter: Chapter } | null;
  monthVerse: { verse: Verse; chapter: Chapter } | null;
  yearVerse: { verse: Verse; chapter: Chapter } | null;
  onGetInsight: (verse: Verse, chapter: Chapter) => void;
  onNavigate: (chapterId: number, verseNumber: number) => void;
}

export const FeaturedVerseSection: React.FC<FeaturedVerseSectionProps> = ({ 
  dayVerse, monthVerse, yearVerse, onGetInsight, onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'day' | 'month' | 'year'>('day');

  const current = activeTab === 'day' ? dayVerse : activeTab === 'month' ? monthVerse : yearVerse;

  if (!current) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daily Reflection</h2>
        </div>
        <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
          {(['day', 'month', 'year'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 rounded-[3rem] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-1000"></div>
        <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 md:p-16 shadow-xl shadow-slate-200/40 relative overflow-hidden ring-1 ring-slate-100/50">
          
          {/* Subtle Islamic Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none geometric-pattern"></div>
          
          {/* Top Corner Decor */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
             <svg className="w-80 h-80 text-emerald-800" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
             </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-10">
              <span className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 shadow-sm">
                Divine Verse of the {activeTab}
              </span>
            </div>

            <button 
              onClick={() => {
                triggerHaptic('medium');
                onNavigate(current.chapter.id, current.verse.verse_number);
              }}
              className="arabic-text text-4xl md:text-6xl leading-[1.8] text-slate-900 mb-10 max-w-5xl hover:text-emerald-600 transition-colors duration-500 cursor-pointer drop-shadow-sm font-bold"
            >
              {current.verse.text_uthmani}
            </button>

            <div className="relative mb-12 max-w-3xl">
              <svg className="absolute -top-6 -left-6 w-12 h-12 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21ZM16.017 21H19.017V18H16.017V21ZM5 21H8V18H5V21ZM21.017 13.5V2H14.017V5.5H17.517V13.5H21.017ZM10 13.5V2H3V5.5H6.5V13.5H10Z" />
              </svg>
              <p className="text-xl md:text-2xl text-slate-600 italic leading-relaxed font-light">
                "{current.verse.translations?.[0]?.text.replace(/<[^>]*>?/gm, '')}"
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <button 
                onClick={() => {
                  triggerHaptic('medium');
                  onNavigate(current.chapter.id, current.verse.verse_number);
                }}
                className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-8 py-4 rounded-2xl uppercase tracking-widest transition-all duration-300 border border-slate-100 hover:border-emerald-100 shadow-sm"
              >
                <span>Surah {current.chapter.name_complex} • {current.chapter.id}:{current.verse.verse_number}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  triggerHaptic('medium');
                  onGetInsight(current.verse, current.chapter);
                }}
                className="flex items-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-500/20 transition-all active:scale-95 group/btn"
              >
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 group-hover/btn:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Unveil AI Insight</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
