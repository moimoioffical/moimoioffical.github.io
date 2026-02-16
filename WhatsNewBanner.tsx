
import React from 'react';

interface WhatsNewBannerProps {
  onClose: () => void;
}

export const WhatsNewBanner: React.FC<WhatsNewBannerProps> = ({ onClose }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-3xl border-b-4 border-blue-800 shadow-2xl mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Close what's new banner"
      >
        <span className="font-black text-sm">✕</span>
      </button>
      <div className="flex items-center gap-4">
        <div className="text-4xl">🎉</div>
        <div>
          <h3 className="font-black text-xl">Welcome Back & What's New!</h3>
          <ul className="list-disc list-inside text-sm font-medium mt-2 space-y-1">
            <li>**Speaking Exercises:** Test your pronunciation with our new AI-powered speaking practice!</li>
            <li>**Leaderboard:** Compete with other learners and climb the ranks to become a Nalibo master.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
