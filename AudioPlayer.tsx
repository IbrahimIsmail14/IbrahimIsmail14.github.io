
import React, { useRef, useState, useEffect } from 'react';
import { AudioFile, Chapter, Reciter } from '../types';
import { triggerHaptic } from '../services/hapticService';

interface AudioPlayerProps {
  audioFile: AudioFile | null;
  chapter: Chapter | null;
  reciters: Reciter[];
  selectedReciterId: number;
  onReciterChange: (id: number) => void;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioFile, 
  chapter, 
  reciters, 
  selectedReciterId, 
  onReciterChange, 
  onEnded 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReciters, setShowReciters] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current || !audioFile) return;

      try {
        audioRef.current.pause();
        const playPromise = audioRef.current.play();
        playPromiseRef.current = playPromise;

        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        }
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioFile?.audio_url]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    triggerHaptic('medium');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Manual play failed:", error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const selectedReciter = reciters.find(r => r.id === selectedReciterId);

  if (!audioFile) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-[800px] glass border border-white/40 shadow-2xl z-[70] p-5 md:p-6 rounded-[2.5rem] animate-in slide-in-from-bottom-12 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Info & Reciter */}
        <div className="flex items-center space-x-5 w-full md:w-auto relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20 rotate-3">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-extrabold text-slate-800 truncate text-sm">Surah {chapter?.name_complex}</h4>
            <button 
              onClick={() => {
                triggerHaptic('light');
                setShowReciters(!showReciters);
              }}
              className="flex items-center space-x-2 text-[10px] text-emerald-600 hover:text-emerald-700 font-black uppercase tracking-widest transition-colors mt-1 group/reciter"
            >
              <div className="flex flex-col items-start truncate max-w-[140px]">
                <span className="truncate">{selectedReciter?.translated_name.name || 'Select Reciter'}</span>
                {selectedReciter?.style && (
                  <span className="text-[8px] opacity-60 font-medium lowercase tracking-normal">({selectedReciter.style})</span>
                )}
              </div>
              <svg className={`w-3 h-3 transition-transform ${showReciters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Dropdown */}
          {showReciters && (
            <div className="absolute bottom-20 left-0 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl py-3 z-[80] animate-in fade-in slide-in-from-bottom-4 ring-1 ring-black/5">
              <div className="px-5 py-3 border-b border-slate-100 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Recitation</p>
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                {reciters.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      triggerHaptic('success');
                      onReciterChange(reciter.id);
                      setShowReciters(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between group ${selectedReciterId === reciter.id ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="overflow-hidden">
                      <p className={`text-sm font-bold truncate ${selectedReciterId === reciter.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {reciter.translated_name.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedReciterId === reciter.id ? 'text-emerald-600/70' : 'text-slate-500'}`}>
                          {reciter.style}
                        </span>
                      </div>
                    </div>
                    {selectedReciterId === reciter.id && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/20">
                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-grow w-full">
          <div className="flex items-center space-x-6">
             <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              {isPlaying ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <div className="flex-grow">
               <div className="relative h-2 bg-slate-200/50 rounded-full overflow-hidden shadow-inner group cursor-pointer">
                  <div 
                    className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
               <div className="flex justify-between mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Stream</span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">MP3 128K</span>
               </div>
            </div>
          </div>
        </div>

        <audio 
          ref={audioRef} 
          src={audioFile.audio_url} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};
