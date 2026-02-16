
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Lesson, UserProgress, User } from './types';
import { LESSONS } from './constants';
import { ExerciseView } from './components/Exercise';
import { TutorChat } from './components/TutorChat';
import { SettingsModal } from './components/SettingsModal';
import { Leaderboard } from './components/Leaderboard';
import { Auth } from './components/Auth';
import { WhatsNewBanner } from './components/WhatsNewBanner';
import { generateAudioPronunciation, playAudio } from './services/geminiService';
import * as userService from './services/userService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'APP' | 'LEADERBOARD'>('APP');
  const [mode, setMode] = useState<'MAP' | 'OBJECTIVES' | 'STORY' | 'VOCAB' | 'EXERCISE' | 'FINISHED' | 'GAMEOVER' | 'TUTOR_CHAT'>('MAP');
  
  const [currentLesson, setCurrentLesson] = useState<Lesson>(LESSONS[0]);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [perfectLesson, setPerfectLesson] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    const user = userService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (showWhatsNew) {
      const timer = setTimeout(() => {
        setShowWhatsNew(false);
      }, 7000); // Auto-dismiss after 7 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [showWhatsNew]);

  const handleLogin = (username: string, password: string) => {
    const user = userService.login(username, password);
    if (user) {
      setCurrentUser(user);
      setView('APP');
      setMode('MAP');
      setShowWhatsNew(true);
    }
  };
  
  const handleSignup = (username: string, password: string) => {
    const user = userService.signup(username, password);
    if (user) {
      setCurrentUser(user);
      setView('APP');
      setMode('MAP');
      setShowWhatsNew(true);
    }
  };

  const handleLogout = () => {
    userService.logout();
    setCurrentUser(null);
  };
  
  const updateProgress = (updater: (prevProgress: UserProgress) => UserProgress) => {
    if (!currentUser) return;
    const newProgress = updater(currentUser.progress);
    const updatedUser = { ...currentUser, progress: newProgress };
    setCurrentUser(updatedUser);
    userService.saveUser(updatedUser);
  };

  const handleSavePremiumKey = (key: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, apiKey: key };
    setCurrentUser(updatedUser);
    userService.saveUser(updatedUser);
  };

  const startLessonFlow = (lesson: Lesson) => {
    if (!currentUser) return;
    const prevLessonIdx = LESSONS.indexOf(lesson) - 1;
    const isLocked = prevLessonIdx >= 0 && !currentUser.progress.completedLessons.includes(LESSONS[prevLessonIdx].id);
    
    if (isLocked) return;
    
    setCurrentLesson(lesson);
    setPerfectLesson(true);
    setCurrentExerciseIdx(0);
    setMode('OBJECTIVES');
  };

  const handleExerciseComplete = (isCorrect: boolean) => {
    if (!currentUser) return;
    if (!isCorrect) {
      setPerfectLesson(false);
      updateProgress(prev => ({
        ...prev,
        lives: Math.max(0, prev.lives - 1)
      }));
      
      if (currentUser.progress.lives <= 1) {
          setTimeout(() => setMode('GAMEOVER'), 1500);
          return;
      }
    } else {
      updateProgress(prev => ({ ...prev, xp: prev.xp + 20 }));
    }
  };

  const advanceExercise = () => {
    if (currentExerciseIdx < currentLesson.exercises.length - 1) {
      setCurrentExerciseIdx(prev => prev + 1);
    } else {
      completeLesson();
    }
  };

  const completeLesson = () => {
    setMode('FINISHED');
    const gemBonus = perfectLesson ? 15 : 5;
    updateProgress(prev => {
      const newCompleted = prev.completedLessons.includes(currentLesson.id) 
        ? prev.completedLessons 
        : [...prev.completedLessons, currentLesson.id];
      
      return {
        ...prev,
        completedLessons: newCompleted,
        xp: prev.xp + 100,
        gems: prev.gems + gemBonus,
        streak: prev.streak + 1
      };
    });
  };

  const buyLives = () => {
      if (!currentUser || currentUser.progress.gems < 10) return;
      updateProgress(prev => ({ ...prev, gems: prev.gems - 10, lives: 5 }));
      setMode('MAP');
  };

  const handleSpeak = async (word: string) => {
    setIsSpeaking(word);
    const audio = await generateAudioPronunciation(word);
    if (audio) {
      await playAudio(audio);
    }
    setIsSpeaking(null);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onSignup={handleSignup} />;
  }

  const { progress } = currentUser;

  return (
    <Layout 
      xp={progress.xp} 
      gems={progress.gems} 
      lives={progress.lives} 
      streak={progress.streak}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onShowLeaderboard={() => setView('LEADERBOARD')}
      onShowMap={() => setView('APP')}
      onLogout={handleLogout}
    >
      <div className="max-w-2xl mx-auto pb-12">
        {view === 'LEADERBOARD' && <Leaderboard currentUser={currentUser} />}

        {view === 'APP' && (
          <>
            {mode === 'MAP' && (
              <>
                {showWhatsNew && <WhatsNewBanner onClose={() => setShowWhatsNew(false)} />}
                <div className="flex flex-col items-center py-10 space-y-12">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">The Nalibo Path</h2>
                    <p className="text-slate-500 font-bold italic">Welcome, {currentUser.username}! Your journey continues.</p>
                  </div>
                  
                  <div className="relative flex flex-col items-center space-y-16 w-full max-w-sm">
                    <div className="absolute top-0 right-0 -translate-y-4">
                       <button 
                        onClick={() => setMode('TUTOR_CHAT')}
                        className="group relative flex flex-col items-center"
                       >
                          <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-slate-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap shadow-xl">
                            Linguistic Assistant
                          </div>
                          <div className={`w-16 h-16 rounded-2xl border-b-4 shadow-xl flex items-center justify-center text-3xl transition-all transform group-hover:scale-110 cursor-pointer ${
                            currentUser.apiKey ? 'bg-gradient-to-br from-blue-500 to-slate-700 border-blue-900' : 'bg-slate-200 border-slate-400 grayscale'
                          }`}>
                            🧪
                          </div>
                          <span className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md">Research Lab</span>
                       </button>
                    </div>

                    {LESSONS.map((lesson, idx) => {
                      const isCompleted = progress.completedLessons.includes(lesson.id);
                      const isLocked = idx > 0 && !progress.completedLessons.includes(LESSONS[idx-1].id);
                      const offsetClass = idx % 2 === 0 ? 'translate-x-12' : '-translate-x-12';

                      return (
                        <div key={lesson.id} className={`flex flex-col items-center ${offsetClass}`}>
                          <button
                            onClick={() => startLessonFlow(lesson)}
                            disabled={isLocked}
                            className={`w-24 h-24 rounded-full border-b-8 flex items-center justify-center text-4xl shadow-xl transition-all transform active:scale-90 ${
                              isLocked 
                                ? 'bg-slate-200 border-slate-300 grayscale cursor-not-allowed' 
                                : isCompleted 
                                ? 'bg-green-500 border-green-700 text-white' 
                                : 'bg-blue-500 border-blue-700 text-white ring-8 ring-blue-100'
                            }`}
                          >
                            {isLocked ? '🔒' : lesson.icon}
                          </button>
                          <div className="mt-4 bg-white px-4 py-1 rounded-full border-2 border-slate-200 shadow-sm">
                              <span className="font-black text-slate-700 text-[10px] uppercase tracking-wide">{lesson.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {mode === 'TUTOR_CHAT' && (
              <TutorChat 
                currentUser={currentUser}
                onBack={() => setMode('MAP')} 
                onOpenPremium={() => setIsSettingsOpen(true)} 
              />
            )}

            {mode === 'OBJECTIVES' && (
              <div className="bg-white p-8 rounded-[2rem] border-b-8 border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase">
                    {currentLesson.level}
                  </span>
                  <h2 className="text-4xl font-black text-slate-800 mt-4 leading-tight">{currentLesson.title}</h2>
                </div>
                
                <div className="space-y-4 mb-10">
                  <h3 className="font-black text-slate-500 text-xs uppercase tracking-widest">Lesson Objectives</h3>
                  {currentLesson.canDoStatements.map((statement, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 group hover:border-blue-200 transition-colors">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white font-black shadow-sm group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 font-bold">{statement}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setMode('STORY')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-200 transform active:translate-y-1 active:shadow-none"
                >
                  START MODULE
                </button>
              </div>
            )}

            {mode === 'STORY' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] border-b-8 border-slate-200 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">📖</div>
                    <div>
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">In Practice</span>
                       <h3 className="text-xl font-black text-slate-800">Interpretive Reading</h3>
                    </div>
                  </div>

                  <div className="relative p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 italic text-slate-700 text-xl leading-relaxed mb-8">
                    <span className="absolute -top-4 -left-2 text-6xl text-slate-200 pointer-events-none">“</span>
                    {currentLesson.storySegment}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border-b-4 border-slate-200">
                      <h4 className="text-slate-600 font-black text-xs uppercase mb-3 tracking-widest flex items-center gap-2">
                        💡 Conlang Note
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {currentLesson.linguisticNote.description}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-3xl border-b-4 border-blue-200">
                      <h4 className="text-blue-600 font-black text-xs uppercase mb-3 tracking-widest flex items-center gap-2">
                        🔄 Contrastive Analysis
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {currentLesson.comparisonNote}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setMode('VOCAB')}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 transform active:translate-y-1"
                  >
                    PREVIEW VOCABULARY
                  </button>
                </div>
              </div>
            )}

            {mode === 'VOCAB' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] border-b-8 border-slate-200 shadow-2xl">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">🗂️</div>
                      <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Nalibo Lexicon</span>
                        <h3 className="text-xl font-black text-slate-800">New Vocabulary</h3>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      {currentLesson.vocab.map((v, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-blue-200 transition-all group">
                           <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-blue-600">{v.nalibo}</span>
                                <span className="text-[10px] font-black text-slate-300 uppercase">{v.category}</span>
                              </div>
                              <span className="text-sm font-bold text-slate-600">{v.english}</span>
                           </div>
                           <button 
                            onClick={() => handleSpeak(v.nalibo)}
                            className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all ${isSpeaking === v.nalibo ? 'animate-pulse text-blue-500' : ''}`}
                           >
                             🔊
                           </button>
                        </div>
                      ))}
                   </div>

                   <button 
                    onClick={() => setMode('EXERCISE')}
                    className="w-full mt-10 bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-green-100 transform active:translate-y-1"
                  >
                    PROCEED TO EXERCISES
                  </button>
                </div>
              </div>
            )}

            {mode === 'EXERCISE' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <button onClick={() => setMode('MAP')} className="text-slate-400 font-black hover:text-slate-600">✕</button>
                   <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${((currentExerciseIdx) / currentLesson.exercises.length) * 100}%` }}
                      />
                   </div>
                   <span className="text-slate-400 font-black text-xs">{currentExerciseIdx + 1}/{currentLesson.exercises.length}</span>
                </div>
                <ExerciseView 
                  exercise={currentLesson.exercises[currentExerciseIdx]} 
                  lives={progress.lives}
                  onComplete={handleExerciseComplete} 
                  onAdvance={advanceExercise}
                />
              </div>
            )}

            {mode === 'GAMEOVER' && (
              <div className="text-center py-20 bg-white rounded-[3rem] border-b-8 border-red-200 shadow-2xl animate-in zoom-in duration-300">
                <div className="text-8xl mb-8">⚠️</div>
                <h2 className="text-4xl font-black text-slate-800 mb-4 leading-tight">Session Ended</h2>
                <p className="text-slate-500 mb-10 max-w-xs mx-auto font-bold italic">You have exhausted your current learning energy. Review your notes and try again.</p>
                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                  <button 
                    onClick={buyLives}
                    disabled={progress.gems < 10}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100"
                  >
                    RESTORE ENERGY (10 💎)
                  </button>
                  <button 
                    onClick={() => setMode('MAP')}
                    className="text-slate-400 font-black hover:text-slate-600 text-sm uppercase tracking-widest"
                  >
                    BACK TO OVERVIEW
                  </button>
                </div>
              </div>
            )}

            {mode === 'FINISHED' && (
              <div className="text-center py-20 bg-white rounded-[3rem] border-b-8 border-green-200 shadow-2xl animate-in zoom-in duration-300">
                <div className="relative inline-block mb-10">
                    <div className="text-9xl">🎓</div>
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-2 leading-tight">Module Mastered!</h2>
                <p className="text-slate-500 mb-8 font-bold italic">Your understanding of Nalibo structure is progressing.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-10 max-w-sm mx-auto">
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
                        <p className="text-slate-600 font-black text-xs uppercase mb-1">XP Earned</p>
                        <p className="text-2xl font-black text-slate-700">+120</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 shadow-sm">
                        <p className="text-blue-600 font-black text-xs uppercase mb-1">Bonus Gems</p>
                        <p className="text-2xl font-black text-slate-700">+{perfectLesson ? 15 : 5} 💎</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 max-w-xs mx-auto px-6">
                  <button 
                    onClick={() => {
                      setMode('MAP');
                      setCurrentExerciseIdx(0);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 active:translate-y-1"
                  >
                    CONTINUE TO PATH
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSavePremiumKey} 
        currentKey={currentUser.apiKey || ''}
      />
    </Layout>
  );
};

export default App;
