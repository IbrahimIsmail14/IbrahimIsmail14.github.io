
import React, { useState, useEffect } from 'react';
import { PrayerTimes, UserPrayerSettings } from '../types';
import { formatRemainingTime } from '../services/prayerService';
import { triggerHaptic } from '../services/hapticService';

interface PrayerTimesSectionProps {
  timings: PrayerTimes | null;
  nextPrayer: { name: string; time: Date } | null;
  settings: UserPrayerSettings;
  onSettingsChange: (settings: UserPrayerSettings) => void;
  onLocationRequest: () => void;
}

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  timings,
  nextPrayer,
  settings,
  onSettingsChange,
  onLocationRequest
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!nextPrayer) return;
    
    const interval = setInterval(() => {
      const diff = nextPrayer.time.getTime() - new Date().getTime();
      if (diff <= 0) {
        window.location.reload(); // Refresh to get next prayer
      }
      setTimeLeft(formatRemainingTime(diff));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [nextPrayer]);

  if (!timings) {
    return (
      <div className="mb-12 bg-white p-8 rounded-[40px] border border-emerald-100 shadow-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Prayer Times</h3>
        <p className="text-slate-500 mb-6">Enable location to see accurate prayer timings for your area.</p>
        <button 
          onClick={() => {
            triggerHaptic('medium');
            onLocationRequest();
          }}
          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          Enable Location
        </button>
      </div>
    );
  }

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="mb-12 bg-white rounded-[40px] border border-emerald-100 shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* Next Prayer Highlight */}
      <div className="md:w-1/3 bg-emerald-600 p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
        <p className="text-emerald-100 uppercase tracking-widest text-xs font-bold mb-2">Next Prayer</p>
        <h3 className="text-4xl font-black mb-1">{nextPrayer?.name}</h3>
        <p className="text-emerald-200 text-sm font-medium mb-6">{nextPrayer?.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <div className="bg-white/20 px-6 py-2 rounded-full font-mono text-xl backdrop-blur-sm border border-white/10">
          {timeLeft}
        </div>
      </div>

      {/* Full Schedule */}
      <div className="md:w-2/3 p-8 flex flex-col justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {prayers.map((name) => (
            <div key={name} className={`p-4 rounded-3xl text-center transition-all ${nextPrayer?.name === name ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50'}`}>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">{name}</p>
              <p className={`text-lg font-bold ${nextPrayer?.name === name ? 'text-emerald-700' : 'text-slate-700'}`}>
                {timings[name]}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={settings.notificationsEnabled}
                onChange={() => {
                  triggerHaptic('light');
                  onSettingsChange({...settings, notificationsEnabled: !settings.notificationsEnabled});
                }}
              />
              <div className={`w-10 h-6 rounded-full transition-colors relative ${settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Notifications</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={settings.adhaanEnabled}
                onChange={() => {
                  triggerHaptic('light');
                  onSettingsChange({...settings, adhaanEnabled: !settings.adhaanEnabled});
                }}
              />
              <div className={`w-10 h-6 rounded-full transition-colors relative ${settings.adhaanEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.adhaanEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Auto Adhaan</span>
            </label>
          </div>
          
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Automatic Geolocation
          </div>
        </div>
      </div>
    </div>
  );
};
