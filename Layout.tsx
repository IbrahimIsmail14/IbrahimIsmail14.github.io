
import React from 'react';
import { AppState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick: () => void;
  onProfileClick: () => void;
  onProgressClick: () => void;
  onCalendarClick: () => void;
  currentAppState: AppState;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onHomeClick, 
  onProfileClick, 
  onProgressClick, 
  onCalendarClick,
  currentAppState
}) => {
  const getNavClass = (state: AppState) => 
    `text-xs md:text-sm font-black uppercase tracking-widest transition-all px-5 py-2.5 rounded-2xl ${
      currentAppState === state 
        ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 shadow-sm' 
        : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50 border border-transparent'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass border-b border-slate-200/50 sticky top-0 z-[60] py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={onHomeClick}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="w-12 h-12 quran-gradient rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500 rotate-3">
              <span className="text-2xl font-black">ن</span>
            </div>
            <div className="flex flex-col items-start">
               <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">Nur Quran</span>
               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1 ml-0.5">Divine Knowledge</span>
            </div>
          </button>
          
          <nav className="flex items-center space-x-1 md:space-x-3">
            <button onClick={onHomeClick} className={getNavClass(AppState.HOME)}>Home</button>
            <button onClick={onProgressClick} className={getNavClass(AppState.PROGRESS)}>Journey</button>
            <button onClick={onCalendarClick} className={getNavClass(AppState.CALENDAR)}>Calendar</button>
            
            <div className="h-8 w-px bg-slate-200/60 mx-3 hidden md:block"></div>
            
            <button 
              onClick={onProfileClick}
              className={`flex items-center space-x-2 p-3 rounded-2xl transition-all duration-300 border ${
                currentAppState === AppState.PROFILE 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border-slate-200/60 hover-lift'
              }`}
              title="Profile & Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-16 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-6 opacity-30">
            <div className="w-8 h-px bg-slate-300"></div>
            <div className="text-xl font-black text-slate-400">ن</div>
            <div className="w-8 h-px bg-slate-300"></div>
          </div>
          <div className="text-emerald-600 font-black text-lg mb-4 tracking-tighter uppercase">Nur Quran</div>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed font-medium">
            Dedicated to seeking knowledge, spiritual growth, and the pursuit of Divine wisdom in the modern age.
          </p>
          <div className="mt-12 flex justify-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
             <span>Quran API V4</span>
             <span className="w-1 h-1 rounded-full bg-slate-200 mt-1.5"></span>
             <span>Gemini AI Engine</span>
             <span className="w-1 h-1 rounded-full bg-slate-200 mt-1.5"></span>
             <span>© {new Date().getFullYear()} Nur Quran</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
