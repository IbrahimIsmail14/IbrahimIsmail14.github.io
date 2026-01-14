
import React from 'react';
import { Reciter, UserPrayerSettings, UserProfile } from '../types';
import { triggerHaptic } from '../services/hapticService';

interface ProfileSectionProps {
  profile: UserProfile;
  prayerSettings: UserPrayerSettings;
  reciters: Reciter[];
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdatePrayerSettings: (settings: UserPrayerSettings) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  prayerSettings,
  reciters,
  onUpdateProfile,
  onUpdatePrayerSettings,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ ...profile, name: e.target.value });
  };

  const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    triggerHaptic('light');
    onUpdateProfile({ ...profile, preferredReciterId: Number(e.target.value) });
  };

  const toggleNotification = (type: 'notificationsEnabled' | 'adhaanEnabled') => {
    triggerHaptic('medium');
    onUpdatePrayerSettings({ ...prayerSettings, [type]: !prayerSettings[type] });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/10 border-4 border-white">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Assalamu Alaikum, {profile.name || 'User'}</h1>
        <p className="text-slate-500 mt-2">Personalize your spiritual journey with Nur Quran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </span>
            General Identity
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Default Reciter</label>
              <select 
                value={profile.preferredReciterId}
                onChange={handleReciterChange}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
              >
                {reciters.map(r => (
                  <option key={r.id} value={r.id}>{r.translated_name.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
            Preferences
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl">
              <div>
                <p className="font-bold text-slate-800">Prayer Notifications</p>
                <p className="text-xs text-slate-500">Alert me when it's time to pray</p>
              </div>
              <button 
                onClick={() => toggleNotification('notificationsEnabled')}
                className={`w-12 h-7 rounded-full transition-colors relative ${prayerSettings.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${prayerSettings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl">
              <div>
                <p className="font-bold text-slate-800">Auto Adhaan</p>
                <p className="text-xs text-slate-500">Play the call to prayer automatically</p>
              </div>
              <button 
                onClick={() => toggleNotification('adhaanEnabled')}
                className={`w-12 h-7 rounded-full transition-colors relative ${prayerSettings.adhaanEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${prayerSettings.adhaanEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 flex items-center space-x-6">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-emerald-800">Data & Privacy</h4>
          <p className="text-sm text-emerald-600/80 leading-relaxed">Your settings are stored locally on your device. We do not track or store your personal data on our servers.</p>
        </div>
      </div>
    </div>
  );
};
