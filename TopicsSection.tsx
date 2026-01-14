
import React from 'react';

interface TopicsSectionProps {
  onTopicClick: (topic: string) => void;
}

export const TopicsSection: React.FC<TopicsSectionProps> = ({ onTopicClick }) => {
  const topics = [
    { title: 'About Quran', icon: '📖', desc: 'Origins, compilation, and significance of the Word of Allah.' },
    { title: 'Hadith & Wisdom', icon: '📜', desc: 'The prophetic sayings that guide us toward character and faith.' },
    { title: 'Seerah of the Prophet', icon: '🕋', desc: 'The life and journey of Muhammad (PBUH), the Mercy to Mankind.' },
    { title: 'Daily Duas', icon: '🤲', desc: 'Authentic supplications for protection, peace, and guidance.' },
    { title: 'Ramadan Knowledge', icon: '🌙', desc: 'Understanding the wisdom and rules of the blessed month.' },
    { title: 'Sunnah Lifestyle', icon: '🕊️', desc: 'Practical habits of the Prophet (PBUH) for a better life.' },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center space-x-2 mb-6 px-1">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
           </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Knowledge Explorer</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <button
            key={topic.title}
            onClick={() => onTopicClick(topic.title)}
            className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.08] transition-all duration-700">
              {topic.icon}
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
              {topic.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
              {topic.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed relative z-10">
              {topic.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
