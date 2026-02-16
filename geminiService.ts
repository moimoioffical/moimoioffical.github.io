
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { NALIBO_GRAMMAR_SUMMARY, NALIBO_PHONETICS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTutorFeedback = async (userAnswer: string, correctAnswer: string, prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert conlang professor teaching 'Nalibo'. 
      
      CORE LINGUISTICS (STRICT NALIBO GUIDE):
      ${NALIBO_GRAMMAR_SUMMARY}
      
      SPECIFIC VOCABULARY RULES:
      - Eat: Amere (Root)
      - Drink: Drinķa (Root)
      - Fruit: Frutes
      - Coffee: Kafi
      - Book: Libre or Boke
      - Particles: Must be post-positional (Subject + Particle).
      
      EXERCISE CONTEXT:
      Prompt: "${prompt}"
      Target Answer: "${correctAnswer}"
      User's Attempt: "${userAnswer}"
      
      TASK:
      If the answer is correct:
      - Provide a very brief confirmation (e.g., "Sol! Corecta.").
      
      If the answer is incorrect:
      - Identify the error: Is it wrong vocabulary (e.g. using 'mane' instead of 'Amere')? Wrong particle order?
      - Reference the rule from the guide. Explain why "Frutes" is used for fruit and "Amere" for eat.
      - Explain the SVO and Adjective placement rules if relevant.
      - Use Markdown to highlight key terms.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Linguistic analysis failed. Check the guide for rules on Amere and Frutes.";
  }
};

/**
 * Evaluates a user's spoken Nalibo against a target sentence.
 */
export const analyzeSpeakingAttempt = async (base64Audio: string, targetText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Audio,
              mimeType: 'audio/webm;codecs=opus',
            },
          },
          {
            text: `Evaluate the user's spoken Nalibo.
            Target Sentence: "${targetText}"
            Phonetic Rules: ${NALIBO_PHONETICS}
            
            1. Transcribe what you heard.
            2. Compare it to the target sentence.
            3. Rate the pronunciation on a scale of 1-10.
            4. Provide specific feedback on how to improve.
            
            Return your response in this format:
            Transcription: [what you heard]
            Score: [number]/10
            Feedback: [your feedback]
            IsMatch: [True/False] (True if the words match and pronunciation is at least 6/10)`
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Speaking Evaluation Error:", error);
    return "Analysis failed. Transcription: Error. Score: 0/10. Feedback: Could not analyze audio. IsMatch: False";
  }
};

/**
 * Generates audio pronunciation using the Gemini TTS model.
 * Note: Uses a simplified call structure without systemInstruction to avoid 500 errors 
 * frequently encountered in the preview-tts model.
 */
export const generateAudioPronunciation = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [
            {
              text: `Say the following Nalibo word using these phonetics (${NALIBO_PHONETICS}): ${text}`
            }
          ]
        }
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
  } catch (error) {
    console.error("TTS API Error:", error);
  }
  return null;
};

/**
 * Manually decodes and plays raw PCM audio data (24kHz, Mono, Int16).
 * Do not use AudioContext.decodeAudioData for raw PCM bytes.
 */
export const playAudio = async (base64Data: string) => {
  try {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const numChannels = 1;
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, 24000);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        // Convert 16-bit PCM to 32-bit Float
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  } catch (error) {
    console.error("Audio Playback Error:", error);
  }
};
