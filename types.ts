
export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations?: Translation[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
}

export interface Reciter {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: {
    name: string;
  };
}

export interface AudioFile {
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
}

export enum AppState {
  HOME = 'HOME',
  SURAH_DETAIL = 'SURAH_DETAIL',
  PROFILE = 'PROFILE',
  CALENDAR = 'CALENDAR',
  PROGRESS = 'PROGRESS'
}

export interface TafsirResponse {
  summary: string;
  context: string;
  keyLessons: string[];
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface UserPrayerSettings {
  notificationsEnabled: boolean;
  adhaanEnabled: boolean;
}

export interface UserProfile {
  name: string;
  preferredReciterId: number;
}

// Map of ChapterID -> Array of VerseNumbers that are completed
export type UserProgress = Record<number, number[]>;
