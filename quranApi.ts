
import { Chapter, Verse, AudioFile, Reciter } from '../types';

const BASE_URL = 'https://api.quran.com/api/v4';

export const fetchChapters = async (): Promise<Chapter[]> => {
  const response = await fetch(`${BASE_URL}/chapters?language=en`);
  const data = await response.json();
  return data.chapters;
};

export const fetchChapterVerses = async (chapterId: number): Promise<Verse[]> => {
  const [textRes, transRes] = await Promise.all([
    fetch(`${BASE_URL}/quran/verses/uthmani?chapter_number=${chapterId}`),
    fetch(`${BASE_URL}/quran/translations/131?chapter_number=${chapterId}`)
  ]);
  
  const textData = await textRes.json();
  const transData = await transRes.json();

  return textData.verses.map((v: any, index: number) => ({
    ...v,
    translations: [transData.translations[index]]
  }));
};

export const fetchSingleVerse = async (chapterId: number, verseNumber: number): Promise<Verse> => {
  const verseKey = `${chapterId}:${verseNumber}`;
  const [textRes, transRes] = await Promise.all([
    fetch(`${BASE_URL}/quran/verses/uthmani?verse_key=${verseKey}`),
    fetch(`${BASE_URL}/quran/translations/131?verse_key=${verseKey}`)
  ]);
  
  const textData = await textRes.json();
  const transData = await transRes.json();

  return {
    ...textData.verses[0],
    translations: [transData.translations[0]]
  };
};

export const fetchChapterAudio = async (chapterId: number, reciterId: number): Promise<AudioFile> => {
  const response = await fetch(`${BASE_URL}/chapter_recitations/${reciterId}/${chapterId}`);
  const data = await response.json();
  return data.audio_file;
};

export const fetchReciters = async (): Promise<Reciter[]> => {
  const response = await fetch(`${BASE_URL}/resources/recitations?language=en`);
  const data = await response.json();
  return data.recitations.slice(0, 15);
};
