
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Exercise, ExerciseType, Word } from '../types';
import { getTutorFeedback, generateAudioPronunciation, playAudio, analyzeSpeakingAttempt } from '../services/geminiService';

interface ExerciseProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
  onAdvance: () => void;
  lives: number;
}

const playFeedbackTone = (isCorrect: boolean) => {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  if (isCorrect) {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
};

/**
 * Normalizes strings for comparison.
 */
const compareAnswers = (user: string, correct: string) => {
  const normalize = (s: string) => 
    s.toLowerCase()
     .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
     .replace(/\s+/g, ' ')
     .trim();

  const u = normalize(user);
  const c = normalize(correct);

  if (u === c) return true;

  const stripParticles = (s: string) => 
    s.split(' ')
     .filter(word => word !== 'ma' && word !== 'la')
     .join(' ');

  return stripParticles(u) === stripParticles(c);
};

export const ExerciseView: React.FC<ExerciseProps> = ({ exercise, onComplete, onAdvance, lives }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // For Matching
  const [matchingSelections, setMatchingSelections] = useState<{ left: string | null; right: string | null }>({ left: null, right: null });
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [mismatchState, setMismatchState] = useState<boolean>(false);
  const [matchSuccessState, setMatchSuccessState] = useState<boolean>(false);

  // Shuffle right side for matching
  const shuffledRight = useMemo(() => {
    if (!exercise.pairs) return [];
    return [...exercise.pairs].sort(() => Math.random() - 0.5);
  }, [exercise.id, exercise.pairs]);

  useEffect(() => {
    setSelectedWords([]);
    setSelectedOption(null);
    setFeedback(null);
    setStatus('idle');
    setMatchingSelections({ left: null, right: null });
    setMatchedPairs([]);
    setIsSubmitting(false);
    setMismatchState(false);
    setMatchSuccessState(false);
    setRecordedAudio(null);
    setIsRecording(false);
  }, [exercise.id]);

  const handleSpeak = async (nalibo: string) => {
    setIsSpeaking(nalibo);
    const audio = await generateAudioPronunciation(nalibo);
    if (audio) {
      await playAudio(audio);
    }
    setIsSpeaking(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          setRecordedAudio(base64String);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedAudio(null);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required for speaking exercises.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMatch = (type: 'left' | 'right', val: string) => {
    if (status !== 'idle' || matchedPairs.includes(val) || mismatchState || matchSuccessState) return;

    const newSelections = { ...matchingSelections, [type]: val };
    setMatchingSelections(newSelections);

    if (newSelections.left && newSelections.right) {
      const correctPair = exercise.pairs?.find(p => p.left === newSelections.left && p.right === newSelections.right);
      
      if (correctPair) {
        setMatchSuccessState(true);
        playFeedbackTone(true);
        
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, newSelections.left!, newSelections.right!]);
          setMatchingSelections({ left: null, right: null });
          setMatchSuccessState(false);
          
          if (matchedPairs.length + 2 === (exercise.pairs?.length || 0) * 2) {
            setStatus('correct');
            setFeedback("Perfect matching! You've mastered these terms.");
            onComplete(true);
          }
        }, 600);
      } else {
        setMismatchState(true);
        playFeedbackTone(false);
        setShake(true);
        
        setTimeout(() => {
          setShake(false);
          setMismatchState(false);
          setMatchingSelections({ left: null, right: null });
        }, 500);
      }
    }
  };

  const handleAction = async () => {
    if (status !== 'idle') {
      onAdvance();
      return;
    }
    
    setIsSubmitting(true);

    if (exercise.type === ExerciseType.SPEAKING) {
      if (!recordedAudio) return;
      const evaluation = await analyzeSpeakingAttempt(recordedAudio, exercise.correctAnswer);
      const isMatch = evaluation.toLowerCase().includes("ismatch: true");
      
      if (isMatch) {
        setStatus('correct');
        playFeedbackTone(true);
      } else {
        setStatus('incorrect');
        playFeedbackTone(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      onComplete(isMatch);
      setFeedback(evaluation);
      setIsSubmitting(false);
      return;
    }

    let userAnswer = '';
    if (exercise.type === ExerciseType.SENTENCE_BUILDER) {
      userAnswer = selectedWords.join(' ');
    } else if (exercise.type === ExerciseType.MULTIPLE_CHOICE) {
      userAnswer = selectedOption || '';
    } else if (exercise.type === ExerciseType.DRAG_AND_DROP) {
      userAnswer = selectedWords[0] || '';
    }

    const isCorrect = compareAnswers(userAnswer, exercise.correctAnswer);
    
    try {
      if (isCorrect) {
        setStatus('correct');
        playFeedbackTone(true);
      } else {
        setStatus('incorrect');
        playFeedbackTone(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      onComplete(isCorrect);
      const aiFeedback = await getTutorFeedback(userAnswer, exercise.correctAnswer, exercise.prompt);
      setFeedback(aiFeedback);
      
    } catch (error) {
      console.error("Exercise submission error:", error);
      if (!feedback) {
        setFeedback(isCorrect ? "Excellent!" : `Incorrect. The expected Nalibo construction was: **${exercise.correctAnswer}**`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleWord = (word: string) => {
    if (status !== 'idle') return;
    if (exercise.type === ExerciseType.DRAG_AND_DROP) {
      setSelectedWords([word]);
      return;
    }
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const isFormIncomplete = () => {
    if (exercise.type === ExerciseType.SENTENCE_BUILDER) return selectedWords.length === 0;
    if (exercise.type === ExerciseType.MULTIPLE_CHOICE) return !selectedOption;
    if (exercise.type === ExerciseType.DRAG_AND_DROP) return !selectedWords[0];
    if (exercise.type === ExerciseType.SPEAKING) return !recordedAudio;
    return false;
  };

  return (
    <div className={`transition-all duration-300 ${shake && exercise.type !== ExerciseType.MATCHING ? 'animate-shake' : ''}`}>
      {/* Grammar Focus Badge */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
          Focus: {exercise.grammarFocus}
        </div>
      </div>

      <div className={`bg-white p-6 sm:p-8 rounded-3xl border-b-8 transition-all ${
        status === 'correct' ? 'border-green-500 shadow-green-50' : status === 'incorrect' ? 'border-red-500 shadow-red-50' : 'border-slate-200 shadow-xl'
      }`}>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-6">{exercise.prompt}</h3>
        
        <div className="my-8 min-h-[120px]">
          {/* SPEAKING TYPE */}
          {exercise.type === ExerciseType.SPEAKING && (
            <div className="flex flex-col items-center justify-center space-y-8 py-4">
               <div className={`relative group`}>
                  <button
                    disabled={status !== 'idle' || isSubmitting}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`w-28 h-28 rounded-full flex items-center justify-center transition-all transform active:scale-95 border-b-8 ${
                      isRecording 
                        ? 'bg-red-500 border-red-800 animate-pulse text-white' 
                        : recordedAudio 
                        ? 'bg-blue-500 border-blue-800 text-white' 
                        : 'bg-slate-100 border-slate-300 text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-4xl">{isRecording ? '⏹️' : '🎙️'}</span>
                  </button>
                  {status === 'idle' && !isRecording && (
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      {recordedAudio ? "Recorded! Press check below." : "Hold to Record"}
                    </p>
                  )}
               </div>

               <div className="flex flex-col items-center">
                  <button 
                    onClick={() => handleSpeak(exercise.correctAnswer)}
                    className="flex items-center gap-2 text-blue-500 font-bold hover:underline"
                  >
                    <span>🔊 Listen to example</span>
                  </button>
               </div>
            </div>
          )}

          {/* MATCHING TYPE */}
          {exercise.type === ExerciseType.MATCHING && (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Nalibo</p>
                {exercise.pairs?.map((p) => {
                  const isSelected = matchingSelections.left === p.left;
                  const isMatched = matchedPairs.includes(p.left);
                  return (
                    <button
                      key={p.left}
                      disabled={isMatched}
                      onClick={() => handleMatch('left', p.left)}
                      className={`w-full p-4 rounded-xl border-2 font-bold transition-all relative overflow-hidden ${
                        isMatched ? 'bg-green-50 border-green-200 text-green-300' :
                        isSelected ? (
                          mismatchState ? 'border-red-500 bg-red-50 text-red-700 animate-shake' : 
                          matchSuccessState ? 'border-green-500 bg-green-500 text-white animate-success-pop z-10' :
                          'border-blue-500 bg-blue-50 text-blue-700'
                        ) : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {p.left}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">English</p>
                {shuffledRight.map((p) => {
                  const isSelected = matchingSelections.right === p.right;
                  const isMatched = matchedPairs.includes(p.right);
                  return (
                    <button
                      key={p.right}
                      disabled={isMatched}
                      onClick={() => handleMatch('right', p.right)}
                      className={`w-full p-4 rounded-xl border-2 font-bold transition-all relative overflow-hidden ${
                        isMatched ? 'bg-green-50 border-green-200 text-green-300' :
                        isSelected ? (
                          mismatchState ? 'border-red-500 bg-red-50 text-red-700 animate-shake' : 
                          matchSuccessState ? 'border-green-500 bg-green-500 text-white animate-success-pop z-10' :
                          'border-blue-500 bg-blue-50 text-blue-700'
                        ) : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {p.right}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DRAG AND DROP (Fill in blank) */}
          {exercise.type === ExerciseType.DRAG_AND_DROP && (
            <div className="space-y-8">
               <div className="flex flex-wrap justify-center items-center gap-4 py-8 px-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  {exercise.prompt.split('____').map((segment, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="text-xl font-bold text-slate-700">{segment}</span>
                      {idx < arr.length - 1 && (
                        <div className={`min-w-[100px] h-12 border-b-4 flex items-center justify-center transition-all px-2 ${
                          selectedWords[0] ? 'border-blue-500 text-blue-600 font-black text-xl' : 'border-slate-300 border-dashed'
                        }`}>
                          {selectedWords[0] || ""}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
               </div>
               
               <div className="flex flex-wrap gap-3 justify-center">
                  {exercise.words?.map((word, idx) => (
                    <button
                      key={idx}
                      disabled={status !== 'idle'}
                      onClick={() => toggleWord(word.nalibo)}
                      className={`px-6 py-3 rounded-xl border-2 border-b-4 font-bold transition-all ${
                        selectedWords[0] === word.nalibo 
                          ? 'bg-blue-600 border-blue-800 text-white translate-y-1 border-b-0 shadow-none' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm active:translate-y-1 active:border-b-0'
                      }`}
                    >
                      {word.nalibo}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {/* SENTENCE BUILDER */}
          {exercise.type === ExerciseType.SENTENCE_BUILDER && (
            <div className="space-y-6">
              <div className={`min-h-[80px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-center transition-colors ${
                status === 'correct' ? 'border-green-200' : status === 'incorrect' ? 'border-red-200' : 'border-slate-200'
              }`}>
                {selectedWords.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    onClick={() => toggleWord(word)}
                    className="bg-white px-4 py-2 rounded-xl border-2 border-slate-200 shadow-sm font-bold text-slate-700 active:scale-95 transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {exercise.words?.map((word, idx) => {
                  const isUsed = selectedWords.includes(word.nalibo);
                  return (
                    <div key={`bank-wrapper-${idx}`} className="flex flex-col items-center gap-1">
                      <button
                        disabled={isUsed || status !== 'idle'}
                        onClick={() => toggleWord(word.nalibo)}
                        className={`px-4 py-2 rounded-xl border-2 border-b-4 font-bold transition-all transform ${
                          isUsed
                            ? 'bg-slate-100 border-slate-100 text-slate-100'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 active:translate-y-1 active:border-b-0'
                        }`}
                      >
                        {word.nalibo}
                      </button>
                      {!isUsed && (
                        <button 
                          onClick={() => handleSpeak(word.nalibo)}
                          className={`text-[10px] p-1 rounded-full transition-colors ${isSpeaking === word.nalibo ? 'text-blue-500 animate-pulse' : 'text-slate-300 hover:text-blue-400'}`}
                        >
                          🔊 Listen
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MULTIPLE CHOICE */}
          {exercise.type === ExerciseType.MULTIPLE_CHOICE && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exercise.options?.map((option) => (
                <button
                  key={option}
                  disabled={status !== 'idle'}
                  onClick={() => setSelectedOption(option)}
                  className={`p-5 rounded-2xl border-2 border-b-4 font-bold text-left transition-all active:translate-y-1 active:border-b-0 ${
                    selectedOption === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  } ${
                    status === 'correct' && option === exercise.correctAnswer ? 'border-green-500 bg-green-50 text-green-700' : ''
                  } ${
                    status === 'incorrect' && option === selectedOption ? 'border-red-500 bg-red-50 text-red-700' : ''
                  }`}
                >
                  <span className="mr-3 text-slate-300">●</span>
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {feedback && (
          <div className={`flex gap-4 p-5 rounded-2xl mb-6 items-start animate-in slide-in-from-bottom-4 duration-300 ${
            status === 'correct' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}>
            <div className="text-2xl mt-1 flex-shrink-0">{status === 'correct' ? '🌟' : '🧐'}</div>
            <div className="flex-1 overflow-hidden">
              <p className="font-black text-xs uppercase tracking-wider mb-2 opacity-60">
                {status === 'correct' ? 'Fluency Tip' : 'Linguistic Observation'}
              </p>
              <div className="text-sm leading-relaxed prose prose-sm max-w-none whitespace-pre-wrap">
                {feedback}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          {exercise.type !== ExerciseType.MATCHING ? (
            <button
              onClick={handleAction}
              disabled={isSubmitting || (status === 'idle' && isFormIncomplete())}
              className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 ${
                status === 'correct' ? 'bg-green-600 shadow-green-200' : status === 'incorrect' ? 'bg-red-600 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              } disabled:bg-slate-200 disabled:shadow-none`}
            >
              {isSubmitting ? 'ANALYZING...' : status !== 'idle' ? 'CONTINUE' : 'CHECK ANSWER'}
            </button>
          ) : (
            status !== 'idle' && (
              <button
                onClick={onAdvance}
                className="w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-white bg-green-600 shadow-lg shadow-green-200 transition-all transform active:scale-95"
              >
                CONTINUE
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
