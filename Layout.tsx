
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  xp: number;
  gems: number;
  lives: number;
  streak: number;
  onOpenSettings: () => void;
  onShowLeaderboard: () => void;
  onShowMap: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, xp, gems, lives, streak, onOpenSettings, onShowLeaderboard, onShowMap, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={onShowMap} className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <span className="text-white font-black text-2xl">N</span>
            </button>
             <button
              onClick={onShowLeaderboard}
              className="hidden sm:flex items-center gap-2 group p-2 rounded-xl hover:bg-slate-100 transition-colors"
             >
              <span className="text-xl">🏆</span>
              <span className="font-black text-slate-700 text-sm">Leaderboard</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden xs:flex items-center gap-1 sm:gap-2 group">
              <span className="text-orange-500 text-xl group-hover:scale-125 transition-transform">🔥</span>
              <span className="font-black text-slate-700 text-sm sm:text-base">{streak}</span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 group">
              <span className="text-blue-400 text-xl group-hover:scale-125 transition-transform">💎</span>
              <span className="font-black text-slate-700 text-sm sm:text-base">{gems}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 group">
              <span className="text-red-500 text-xl group-hover:scale-125 transition-transform">❤️</span>
              <span className={`font-black text-sm sm:text-base ${lives < 2 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
                {lives}
              </span>
            </div>

            <button 
              onClick={onOpenSettings}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              aria-label="Settings"
            >
              ⚙️
            </button>
             <button 
              onClick={onLogout}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              aria-label="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5.414l7.293 7.293a1 1 0 001.414-1.414L6.414 4H15a1 1 0 100-2H4a1 1 0 00-1 1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs font-medium">
        NALIBO LEARNING PATH • v2.1
      </footer>
    </div>
  );
};
