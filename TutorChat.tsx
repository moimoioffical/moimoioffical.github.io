
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { NALIBO_GRAMMAR_SUMMARY, NALIBO_PHONETICS } from "../constants";
import { User } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface TutorChatProps {
  currentUser: User;
  onBack: () => void;
  onOpenPremium: () => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({ currentUser, onBack, onOpenPremium }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello. I am your Nalibo Linguistic Assistant. I can help you practice conversation or explain the grammatical structure of this conlang. What would you like to focus on?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const premiumKey = currentUser.apiKey;
  const isPremium = !!premiumKey && premiumKey.length > 10;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    if (!isPremium) {
      onOpenPremium();
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${premiumKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { 
              role: 'system', 
              content: `You are a professional Linguistic Assistant for the constructed language 'Nalibo'. 
              Nalibo is a conlang, not a natural language. Use the provided rules to assist the user.
              Nalibo Rules: ${NALIBO_PHONETICS} ${NALIBO_GRAMMAR_SUMMARY}
              Tone: Academic, helpful, and precise. Correct mistakes by referencing the specific conlang rules.` 
            },
            ...messages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || 'Service unavailable. Please try again.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Tutor Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection error. Please check your API key in settings.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-h-[700px] bg-white rounded-[2.5rem] border-b-8 border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className={`p-6 text-white flex items-center justify-between transition-colors ${isPremium ? 'bg-slate-800' : 'bg-slate-700'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <span className="text-xl">←</span>
          </button>
          <div>
            <h2 className="text-xl font-black tracking-tight">Linguistic Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-blue-400' : 'bg-slate-400'}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                {isPremium ? 'Advanced Mode Active' : 'Limited Mode'}
              </span>
            </div>
          </div>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
          {isPremium ? '💡' : '🔒'}
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border-2 border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Locked Overlay */}
        {!isPremium && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-md flex items-center justify-center p-8 text-center">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-b-8 border-blue-500 max-w-xs animate-in zoom-in duration-300">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Premium Tutoring</h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 italic">
                Advanced conversational practice requires an OpenAI API key for complex linguistic processing.
              </p>
              <button 
                onClick={onOpenPremium}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                SETUP KEY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`p-6 bg-white border-t-2 border-slate-100 flex gap-3 ${!isPremium && 'opacity-30 pointer-events-none'}`}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === 'Enter') ? handleSend() : null}
          placeholder="Ask a question about Nalibo..."
          className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 transition-all active:scale-90 disabled:opacity-50"
        >
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
};
