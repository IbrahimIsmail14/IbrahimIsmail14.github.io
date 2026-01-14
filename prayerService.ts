
import { PrayerTimes } from '../types';

export const fetchPrayerTimes = async (lat: number, lon: number): Promise<PrayerTimes> => {
  const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
  const data = await response.json();
  return data.data.timings;
};

export const getNextPrayer = (timings: PrayerTimes) => {
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const now = new Date();
  
  for (const prayer of prayers) {
    const [hours, minutes] = timings[prayer].split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    if (prayerTime > now) {
      return { name: prayer, time: prayerTime };
    }
  }
  
  // If all prayers today have passed, Fajr tomorrow is next
  const [fHours, fMinutes] = timings.Fajr.split(':').map(Number);
  const fajrTomorrow = new Date();
  fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
  fajrTomorrow.setHours(fHours, fMinutes, 0, 0);
  return { name: 'Fajr', time: fajrTomorrow };
};

export const formatRemainingTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};
