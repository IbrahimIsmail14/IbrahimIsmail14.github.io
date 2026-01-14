
import React, { useState, useEffect, useRef } from 'react';
import { Verse, Chapter } from '../types';
import { getVerseInsights } from '../services/geminiService';
import { triggerHaptic } from '../services/hapticService';

interface AyahRowProps {
  verse: Verse;
  chapter: Chapter;
  activeVerse: number | null;
  onPlay: (verseNum: number) => void;
  isCompleted: boolean;
  onToggleComplete: (verseNum: number) => void;
}

export const AyahRow: React.FC<AyahRowProps> = ({ 
  verse, 
  chapter, 
  activeVerse, 
  onPlay, 
  isCompleted, 
  onToggleComplete 
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleGetInsight = async () => {
    triggerHaptic('light');
    if (insight) {
      setInsight(null);
      return;
    }
    setLoadingInsight(true);
    const result = await getVerseInsights(verse, chapter);
    setInsight(result);
    setLoadingInsight(false);
  };

  const isActive = activeVerse === verse.verse_number;

  useEffect(() => {
    if (isActive && rowRef.current) {
      const timeoutId = setTimeout(() => {
        rowRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isActive]);

  return (
    <div 
      ref={rowRef}
      className={`p-10 md:p-14 border-b border-slate-100 transition-all duration-1000 scroll-mt-24 relative ${
        isActive 
          ? 'active-verse-highlight z-10' 
          : 'hover:bg-slate-50/50 bg-white z-0'
      } ${isCompleted ? 'bg-emerald-50/10' : ''}`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500 rounded-r-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
      )}

      <div className="flex flex-col space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border transition-all duration-500 ${
              isActive 
                ? 'text-white bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 bg-slate-50 border-slate-200'
            }`}>
              {chapter.id}:{verse.verse_number}
            </div>
            
            <div className="flex items-center bg-slate-100/50 rounded-2xl p-1 gap-1 border border-slate-200/50">
              <button 
                onClick={() => {
                  triggerHaptic('medium');
                  onPlay(verse.verse_number);
                }}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 bg-white shadow-sm scale-105' 
                    : 'text-slate-400 hover:text-emerald-600 hover:bg-white'
                }`}
                title="Play Verse"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <button 
                onClick={() => {
                  triggerHaptic(isCompleted ? 'light' : 'success');
                  onToggleComplete(verse.verse_number);
                }}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isCompleted 
                    ? 'text-emerald-500 bg-white shadow-sm' 
                    : 'text-slate-300 hover:text-emerald-400 hover:bg-white'
                }`}
                title={isCompleted ? "Mark as unread" : "Mark as read"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleGetInsight}
            disabled={loadingInsight}
            className={`text-[10px] flex items-center space-x-2 font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl transition-all shadow-sm active:scale-95 border ${
              isActive 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' 
                : 'text-slate-500 hover:text-indigo-600 bg-white border-slate-200 hover:border-indigo-200'
            }`}
          >
            {loadingInsight ? (
              <span className="animate-pulse flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{insight ? 'Hide Insight' : 'Insight'}</span>
              </>
            )}
          </button>
        </div>

        <div className={`arabic-text text-4xl md:text-6xl text-right transition-all duration-700 ${
          isActive ? 'text-slate-900 drop-shadow-sm scale-[1.02]' : 'text-slate-700'
        } ${isCompleted ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
          {verse.text_uthmani}
          <div className="inline-block mr-6">
             <div className="relative inline-flex items-center justify-center">
                <svg className="w-16 h-16 text-emerald-500 opacity-20" fill="currentColor" viewBox="0 0 100 100">
                   <path d="M50 0L61.2 38.8L100 50L61.2 61.2L50 100L38.8 61.2L0 50L38.8 38.8L50 0Z" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-serif text-slate-500 font-bold">
                  {verse.verse_number}
                </span>
             </div>
          </div>
        </div>

        <div className={`text-xl md:text-2xl font-light leading-relaxed max-w-5xl transition-all duration-700 ${
          isActive ? 'text-slate-900 font-normal border-l-4 border-emerald-500/20 pl-8' : 'text-slate-500'
        } ${isCompleted ? 'opacity-40' : 'opacity-100'}`}>
          {verse.translations?.[0]?.text.replace(/<[^>]*>?/gm, '')}
        </div>

        {insight && (
          <div className="mt-8 p-10 bg-indigo-50/30 border border-indigo-100/50 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 text-indigo-900 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400">Gemini AI Reflection</h4>
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Contextual Knowledge</p>
              </div>
            </div>
            <div className="prose prose-indigo prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-indigo-900/80 font-medium">
              {insight}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
