
import React, { useState } from 'react';
import { triggerHaptic } from '../services/hapticService';

export const IslamicCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to get Hijri date formatted string
  const getHijriDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getHijriDay = (date: Date) => {
    return new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      day: 'numeric'
    }).format(date);
  };

  const getHijriMonthName = (date: Date) => {
    return new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
      month: 'long'
    }).format(date);
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const startDayOfWeek = startOfMonth.getDay(); // 0 = Sunday
  const totalDays = endOfMonth.getDate();

  const prevMonth = () => {
    triggerHaptic('light');
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    triggerHaptic('light');
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = [];
  // padding for start of month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  // Common Islamic Dates (Approximate logic for display)
  const isSpecialIslamicDate = (date: Date) => {
    const hijri = getHijriDate(date);
    if (hijri.includes('1 Ramadan')) return { name: 'Ramadan Begins', color: 'bg-emerald-100 text-emerald-700' };
    if (hijri.includes('1 Shawwal')) return { name: 'Eid al-Fitr', color: 'bg-indigo-100 text-indigo-700' };
    if (hijri.includes('10 Dhu al-Hijjah')) return { name: 'Eid al-Adha', color: 'bg-amber-100 text-amber-700' };
    if (hijri.includes('1 Muharram')) return { name: 'Islamic New Year', color: 'bg-slate-100 text-slate-700' };
    return null;
  };

  const getMoonPhaseIcon = (hijriDay: number) => {
    // Basic lunar mapping for Hijri days (approx 29.5 days per month)
    if (hijriDay === 1 || hijriDay >= 29) return { phase: "New Moon", icon: "🌑" };
    if (hijriDay >= 2 && hijriDay <= 6) return { phase: "Waxing Crescent", icon: "🌒" };
    if (hijriDay >= 7 && hijriDay <= 9) return { phase: "First Quarter", icon: "🌓" };
    if (hijriDay >= 10 && hijriDay <= 13) return { phase: "Waxing Gibbous", icon: "🌔" };
    if (hijriDay >= 14 && hijriDay <= 16) return { phase: "Full Moon", icon: "🌕" };
    if (hijriDay >= 17 && hijriDay <= 21) return { phase: "Waning Gibbous", icon: "🌖" };
    if (hijriDay >= 22 && hijriDay <= 24) return { phase: "Last Quarter", icon: "🌗" };
    if (hijriDay >= 25 && hijriDay <= 28) return { phase: "Waning Crescent", icon: "🌘" };
    return { phase: "New Moon", icon: "🌑" };
  };

  const todayHijriDay = parseInt(getHijriDay(new Date()));
  const moonInfo = getMoonPhaseIcon(todayHijriDay);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start justify-between gap-12">
        
        {/* Calendar Main Grid */}
        <div className="flex-1 w-full bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="bg-emerald-600 p-8 text-white flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </h1>
              <p className="text-emerald-100 font-medium mt-1">
                {getHijriMonthName(startOfMonth)} - {getHijriMonthName(endOfMonth)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button onClick={prevMonth} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextMonth} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 md:p-8">
            <div className="grid grid-cols-7 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {days.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} className="h-20 md:h-32"></div>;
                
                const special = isSpecialIslamicDate(date);
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <div 
                    key={date.toISOString()} 
                    className={`h-24 md:h-32 rounded-3xl p-3 border transition-all flex flex-col justify-between relative overflow-hidden group ${
                      isToday ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-50 bg-slate-50/20 hover:border-emerald-100 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-lg font-black ${isToday ? 'text-emerald-600' : 'text-slate-700'}`}>{date.getDate()}</span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{getHijriDay(date)}</span>
                    </div>

                    {special && (
                      <div className={`text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-lg text-center truncate z-10 ${special.color}`}>
                        {special.name}
                      </div>
                    )}

                    {isToday && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calendar Sidebar */}
        <div className="w-full md:w-80 space-y-8">
          {/* Moon Phase Widget */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none geometric-pattern"></div>
            <h3 className="text-lg font-black text-slate-900 mb-6 relative z-10">Lunar Cycle</h3>
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-indigo-500/20 border-4 border-slate-800 mb-4 relative z-10">
              <span className="drop-shadow-lg">{moonInfo.icon}</span>
            </div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest relative z-10">{moonInfo.phase}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 relative z-10">Hijri Day {todayHijriDay}</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black text-slate-900 mb-6">Today's Date</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gregorian</p>
                <p className="font-bold text-slate-800">{new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest mb-1">Hijri</p>
                <p className="font-bold text-emerald-800">{getHijriDate(new Date())}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
             <h3 className="text-lg font-bold mb-4 relative z-10">Notable 2026 Dates</h3>
             <div className="space-y-4 relative z-10 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-gray-400">Ramadan 1447</span>
                   <span className="font-medium text-emerald-400">~ 18 Feb 2026</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-gray-400">Eid al-Fitr</span>
                   <span className="font-medium text-indigo-300">~ 20 Mar 2026</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-gray-400">Eid al-Adha</span>
                   <span className="font-medium text-amber-400">~ 27 May 2026</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-gray-400">Hijri New Year 1448</span>
                   <span className="font-medium text-slate-300">~ 16 Jun 2026</span>
                </div>
             </div>
             <p className="text-[10px] text-gray-500 mt-6 leading-relaxed italic">
               * Hijri dates are subject to moon sighting and may vary by a day.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};
