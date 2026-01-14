
import React from 'react';
import { Chapter, UserProgress } from '../types';
import { triggerHaptic } from '../services/hapticService';

interface ProgressTrackerProps {
  chapters: Chapter[];
  progress: UserProgress;
  onSurahClick: (id: number) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ chapters, progress, onSurahClick }) => {
  const totalVerses = chapters.reduce((acc, c) => acc + c.verses_count, 0);
  const completedVersesCount = Object.values(progress).reduce((acc, verses) => acc + verses.length, 0);
  const overallPercentage = totalVerses > 0 ? Math.round((completedVersesCount / totalVerses) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="bg-white rounded-[40px] border border-emerald-100 p-8 md:p-12 shadow-2xl shadow-emerald-500/5 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Reading Progress</h1>
            <p className="text-slate-500">Your journey through the Divine words. Every verse counts.</p>
          </div>
          
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * overallPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800">{overallPercentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Verses</div>
            <div className="text-2xl font-bold text-slate-800">{totalVerses}</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Read Verses</div>
            <div className="text-2xl font-bold text-emerald-600">{completedVersesCount}</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</div>
            <div className="text-2xl font-bold text-slate-500">{totalVerses - completedVersesCount}</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Chapters Started</div>
            <div className="text-2xl font-bold text-indigo-600">{Object.keys(progress).length}</div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-8 px-1">Chapter Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => {
          const completedCount = progress[chapter.id]?.length || 0;
          const percentage = Math.round((completedCount / chapter.verses_count) * 100);
          
          return (
            <button
              key={chapter.id}
              onClick={() => {
                triggerHaptic('light');
                onSurahClick(chapter.id);
              }}
              className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                  percentage === 100 ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                }`}>
                  {chapter.id}
                </div>
                <div className="text-xs font-bold text-emerald-600">{percentage}%</div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {chapter.name_complex}
                </h3>
                <p className="text-sm text-slate-500">
                  {completedCount} / {chapter.verses_count} Verses
                </p>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${percentage === 100 ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
