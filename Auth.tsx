
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (username: string, password: string) => void;
  onSignup: (username: string, password: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(username, password);
    } else {
      onSignup(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <div className="inline-block w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="text-white font-black text-4xl">N</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 mt-4">Welcome to Nalibo</h1>
            <p className="text-slate-500 font-bold italic">Your journey into a new language awaits.</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border-b-8 border-slate-200 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">
            {isLoginView ? 'Sign In' : 'Create Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-200 transform active:translate-y-1 active:shadow-none"
            >
              {isLoginView ? 'CONTINUE LEARNING' : 'START MY JOURNEY'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            {isLoginView ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-bold text-blue-500 hover:underline">
              {isLoginView ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
