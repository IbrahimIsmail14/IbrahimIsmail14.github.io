
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Chapter, Verse, AudioFile, AppState, Reciter, PrayerTimes, UserPrayerSettings, UserProfile, UserProgress } from './types';
import { fetchChapters, fetchChapterVerses, fetchChapterAudio, fetchReciters, fetchSingleVerse } from './services/quranApi';
import { getSurahTheme, getTopicInfo, getVerseInsights } from './services/geminiService';
import { fetchPrayerTimes, getNextPrayer } from './services/prayerService';
import { triggerHaptic } from './services/hapticService';
import { Layout } from './components/Layout';
import { SurahCard } from './components/SurahCard';
import { AyahRow } from './components/AyahRow';
import { AudioPlayer } from './components/AudioPlayer';
import { PopularSection } from './components/PopularSection';
import { TopicsSection } from './components/TopicsSection';
import { FeaturedVerseSection } from './components/FeaturedVerseSection';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { ProfileSection } from './components/ProfileSection';
import { ProgressTracker } from './components/ProgressTracker';
import { IslamicCalendar } from './components/IslamicCalendar';

const App: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // User Data States
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    preferredReciterId: 7
  });
  const [userProgress, setUserProgress] = useState<UserProgress>({});

  // Prayer Times States
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [prayerSettings, setPrayerSettings] = useState<UserPrayerSettings>({
    notificationsEnabled: false,
    adhaanEnabled: false
  });
  const adhaanAudioRef = useRef<HTMLAudioElement | null>(null);

  // Featured Verses State
  const [featured, setFeatured] = useState<{
    day: { verse: Verse; chapter: Chapter } | null;
    month: { verse: Verse; chapter: Chapter } | null;
    year: { verse: Verse; chapter: Chapter } | null;
  }>({ day: null, month: null, year: null });

  const [surahInfo, setSurahInfo] = useState<string | null>(null);
  const [loadingSurahInfo, setLoadingSurahInfo] = useState(false);
  const [topicModal, setTopicModal] = useState<{ title: string; content: string } | null>(null);
  const [loadingTopic, setLoadingTopic] = useState(false);

  useEffect(() => {
    // Load persisted data
    const savedProfile = localStorage.getItem('nur_quran_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedPrayer = localStorage.getItem('nur_quran_prayer_settings');
    if (savedPrayer) setPrayerSettings(JSON.parse(savedPrayer));

    const savedProgress = localStorage.getItem('nur_quran_progress');
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));

    const init = async () => {
      try {
        const [chapterData, reciterData] = await Promise.all([
          fetchChapters(),
          fetchReciters()
        ]);
        setChapters(chapterData);
        setReciters(reciterData);
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const getVerseForSeed = async (seed: number) => {
          const chapIdx = (seed % 114) + 1;
          const chapter = chapterData.find(c => c.id === chapIdx) || chapterData[0];
          const verseNum = (seed % chapter.verses_count) + 1;
          const verse = await fetchSingleVerse(chapter.id, verseNum);
          return { verse, chapter };
        };

        const [vDay, vMonth, vYear] = await Promise.all([
          getVerseForSeed(year + month + day),
          getVerseForSeed(year * 100 + month),
          getVerseForSeed(year)
        ]);

        setFeatured({ day: vDay, month: vMonth, year: vYear });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const timings = await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
            setPrayerTimes(timings);
            setNextPrayer(getNextPrayer(timings));
          }, () => {
            console.log("Location access denied for prayer times.");
          });
        }
      } catch (err) {
        console.error("Failed to initialize app data", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!prayerTimes || !nextPrayer) return;
    const checkPrayerTime = setInterval(() => {
      const now = new Date();
      if (Math.abs(now.getTime() - nextPrayer.time.getTime()) < 1000) {
        handlePrayerTimeReached(nextPrayer.name);
      }
    }, 1000);
    return () => clearInterval(checkPrayerTime);
  }, [prayerTimes, nextPrayer, prayerSettings]);

  const handlePrayerTimeReached = (name: string) => {
    if (prayerSettings.notificationsEnabled) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Time for ${name}`, { body: `It is now time for ${name} prayer.` });
      }
    }
    if (prayerSettings.adhaanEnabled) {
      if (!adhaanAudioRef.current) adhaanAudioRef.current = new Audio('https://www.islamcan.com/audio/adhan/azan1.mp3');
      adhaanAudioRef.current.play().catch(e => console.error("Adhaan play failed:", e));
    }
    if (prayerTimes) setNextPrayer(getNextPrayer(prayerTimes));
  };

  const handleSettingsChange = (newSettings: UserPrayerSettings) => {
    setPrayerSettings(newSettings);
    localStorage.setItem('nur_quran_prayer_settings', JSON.stringify(newSettings));
    if (newSettings.notificationsEnabled && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('nur_quran_profile', JSON.stringify(newProfile));
  };

  const handleToggleVerseComplete = (verseNum: number) => {
    if (!selectedChapter) return;
    const chapterId = selectedChapter.id;
    const currentCompleted = userProgress[chapterId] || [];
    
    let newCompleted;
    if (currentCompleted.includes(verseNum)) {
      newCompleted = currentCompleted.filter(v => v !== verseNum);
    } else {
      newCompleted = [...currentCompleted, verseNum];
    }
    
    const newProgress = { ...userProgress, [chapterId]: newCompleted };
    setUserProgress(newProgress);
    localStorage.setItem('nur_quran_progress', JSON.stringify(newProgress));
  };

  const handleSurahClick = async (id: number) => {
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) return;
    setSelectedChapter(chapter);
    setAppState(AppState.SURAH_DETAIL);
    setLoadingVerses(true);
    setLoadingSurahInfo(true);
    setVerses([]);
    setActiveVerse(null);
    setSurahInfo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const [verseData, themeData] = await Promise.all([
        fetchChapterVerses(id),
        getSurahTheme(chapter)
      ]);
      setVerses(verseData);
      setSurahInfo(themeData);
      await updateAudio(id, profile.preferredReciterId);
    } catch (err) {
      console.error("Failed to load Surah details", err);
    } finally {
      setLoadingVerses(false);
      setLoadingSurahInfo(false);
    }
  };

  const handleVerseNavigate = async (chapterId: number, verseNumber: number) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    setSelectedChapter(chapter);
    setAppState(AppState.SURAH_DETAIL);
    setLoadingVerses(true);
    setLoadingSurahInfo(true);
    setVerses([]);
    setActiveVerse(verseNumber); // This triggers the scroll inside AyahRow
    setSurahInfo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const [verseData, themeData] = await Promise.all([
        fetchChapterVerses(chapterId),
        getSurahTheme(chapter)
      ]);
      setVerses(verseData);
      setSurahInfo(themeData);
      await updateAudio(chapterId, profile.preferredReciterId);
    } catch (err) {
      console.error("Failed to navigate to verse", err);
    } finally {
      setLoadingVerses(false);
      setLoadingSurahInfo(false);
    }
  };

  const handleTopicClick = async (topic: string) => {
    setLoadingTopic(true);
    setTopicModal({ title: topic, content: 'Fetching knowledge...' });
    try {
      const info = await getTopicInfo(topic);
      setTopicModal({ title: topic, content: info });
    } catch (err) {
      setTopicModal({ title: topic, content: 'Error loading information.' });
    } finally {
      setLoadingTopic(false);
    }
  };

  const handleGetInsight = async (verse: Verse, chapter: Chapter) => {
    setLoadingTopic(true);
    setTopicModal({ title: `Reflection: ${chapter.name_complex} ${chapter.id}:${verse.verse_number}`, content: 'Connecting with AI Wisdom...' });
    try {
      const insight = await getVerseInsights(verse, chapter);
      setTopicModal({ title: `Divine Guidance Reflection`, content: insight });
    } catch (err) {
      setTopicModal({ title: `Reflection`, content: 'Service temporarily unavailable.' });
    } finally {
      setLoadingTopic(false);
    }
  };

  const handlePlayVerse = (verseNum: number) => {
    if (activeVerse === verseNum) {
      setActiveVerse(null);
      setTimeout(() => setActiveVerse(verseNum), 10);
    } else {
      setActiveVerse(verseNum);
    }
  };

  const filteredChapters = useMemo(() => {
    return chapters.filter(c => 
      c.name_complex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString() === searchQuery
    );
  }, [chapters, searchQuery]);

  const updateAudio = async (chapterId: number, reciterId: number) => {
    try {
      const audio = await fetchChapterAudio(chapterId, reciterId);
      setAudioFile(audio);
    } catch (err) {
      console.error("Failed to fetch audio for selected reciter", err);
    }
  };

  return (
    <Layout 
      currentAppState={appState}
      onHomeClick={() => { triggerHaptic('light'); setAppState(AppState.HOME); }}
      onProfileClick={() => { triggerHaptic('medium'); setAppState(AppState.PROFILE); }}
      onProgressClick={() => { triggerHaptic('light'); setAppState(AppState.PROGRESS); }}
      onCalendarClick={() => { triggerHaptic('light'); setAppState(AppState.CALENDAR); }}
    >
      {appState === AppState.HOME && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {profile.name ? `Salam, ${profile.name}` : 'Nur Quran'}
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Explore the Holy Quran with beautiful recitations, AI-powered themes, and intuitive progress tracking.
            </p>
            <div className="mt-10 relative max-w-2xl mx-auto">
              <input 
                type="text" placeholder="Search Surah, Chapter, or Verse..."
                className="w-full px-8 py-5 rounded-3xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-lg shadow-xl shadow-emerald-500/5 bg-white"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <PrayerTimesSection 
            timings={prayerTimes} nextPrayer={nextPrayer} settings={prayerSettings} 
            onSettingsChange={handleSettingsChange} onLocationRequest={() => {}}
          />

          <FeaturedVerseSection 
            dayVerse={featured.day} monthVerse={featured.month} yearVerse={featured.year} 
            onGetInsight={handleGetInsight}
            onNavigate={handleVerseNavigate}
          />

          <PopularSection onSurahClick={handleSurahClick} onSpecialClick={handleTopicClick} />
          <TopicsSection onTopicClick={handleTopicClick} />

          <h2 className="text-2xl font-bold text-slate-800 mb-8 px-1">Chapters</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(12)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChapters.map((chapter) => <SurahCard key={chapter.id} chapter={chapter} onClick={handleSurahClick} />)}
            </div>
          )}
        </div>
      )}

      {appState === AppState.SURAH_DETAIL && (
        <div className="bg-white min-h-screen pb-32">
          {selectedChapter && (
            <div className="max-w-5xl mx-auto">
              <div className="p-8 md:p-16 text-center border-b border-slate-100 relative overflow-hidden bg-slate-50/50">
                <h2 className="arabic-text text-6xl md:text-8xl font-bold text-slate-800 mb-8">{selectedChapter.name_arabic}</h2>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{selectedChapter.name_complex}</h1>
                <p className="text-slate-500 uppercase tracking-widest font-bold text-sm mb-12">
                  {selectedChapter.translated_name.name} • {selectedChapter.verses_count} Verses
                </p>

                {/* AI Theme & Importance Section */}
                {surahInfo && (
                  <div className="text-left mt-12 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-[3rem] p-10 shadow-2xl shadow-emerald-500/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <svg className="w-56 h-56 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                         </svg>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">Divine Context & Themes</h3>
                          <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI Guided Insight</span>
                             <span className="w-1 h-1 rounded-full bg-emerald-200"></span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gemini Engine</span>
                          </div>
                        </div>
                      </div>

                      <div className="prose prose-emerald prose-lg max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                        {surahInfo}
                      </div>
                    </div>
                  </div>
                )}

                {loadingSurahInfo && (
                  <div className="mt-12 mb-16 p-12 bg-white/50 border border-slate-100 rounded-[3rem] animate-pulse flex flex-col items-center justify-center space-y-4">
                     <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                     </div>
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Unveiling Surah Themes via Gemini AI...</span>
                  </div>
                )}

                {selectedChapter.bismillah_pre && <p className="arabic-text text-4xl md:text-5xl text-slate-800 my-10">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>}
              </div>
              <div className="divide-y divide-slate-50">
                {verses.map((verse) => (
                  <AyahRow 
                    key={verse.id} verse={verse} chapter={selectedChapter} activeVerse={activeVerse} onPlay={handlePlayVerse}
                    isCompleted={(userProgress[selectedChapter.id] || []).includes(verse.verse_number)}
                    onToggleComplete={handleToggleVerseComplete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {appState === AppState.PROFILE && (
        <ProfileSection 
          profile={profile} prayerSettings={prayerSettings} reciters={reciters} 
          onUpdateProfile={handleUpdateProfile} onUpdatePrayerSettings={handleSettingsChange}
        />
      )}

      {appState === AppState.PROGRESS && (
        <ProgressTracker 
          chapters={chapters} progress={userProgress} onSurahClick={handleSurahClick}
        />
      )}

      {appState === AppState.CALENDAR && (
        <IslamicCalendar />
      )}

      {topicModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-black">{topicModal.title}</h2>
              <button onClick={() => setTopicModal(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto prose max-w-none whitespace-pre-wrap">{topicModal.content}</div>
          </div>
        </div>
      )}

      <AudioPlayer 
        audioFile={audioFile} chapter={selectedChapter} reciters={reciters} selectedReciterId={profile.preferredReciterId}
        onReciterChange={(id) => handleUpdateProfile({ ...profile, preferredReciterId: id })} onEnded={() => setActiveVerse(null)}
      />
    </Layout>
  );
};

export default App;
