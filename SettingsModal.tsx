
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] border-b-8 border-blue-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-8 text-white">
          <h2 className="text-2xl font-black">Preferences</h2>
          <p className="text-slate-300 text-sm font-bold opacity-90">Manage your advanced tutoring configurations.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              OpenAI API Key (Advanced Tutor)
            </label>
            <input 
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed px-1 font-medium">
              * This key is stored locally in your browser and used only to power the advanced linguistic tutoring features.
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all"
            >
              CANCEL
            </button>
            <button 
              onClick={() => {
                onSave(key);
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
