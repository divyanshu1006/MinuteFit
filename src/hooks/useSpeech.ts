import { useRef, useCallback, useEffect } from 'react';

// Store reference globally on window to prevent Chromium garbage collection bug
declare global {
  interface Window {
    __activeUtterance?: SpeechSynthesisUtterance | null;
  }
}

export const useSpeech = (enabled: boolean) => {
  const lastSpokenRef = useRef<{ text: string; time: number }>({ text: '', time: 0 });
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.__activeUtterance = null;
    }
  }, []);

  const speak = useCallback((text: string, options: { immediate?: boolean; delay?: number } = {}) => {
    if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    const now = performance.now();
    // Guard against rapid duplicate speech within 400ms
    if (lastSpokenRef.current.text === trimmed && (now - lastSpokenRef.current.time) < 400) {
      return;
    }
    lastSpokenRef.current = { text: trimmed, time: now };

    const executeSpeak = () => {
      try {
        // Chromium resume workaround
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        // Cancel previous speech to keep real-time cues strictly synchronized
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(trimmed);
        window.__activeUtterance = utterance;

        utterance.rate = 1.15; // Slightly brisk for clear, prompt fitness cues
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Select best English voice if available
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice =
            voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))) ||
            voices.find(v => v.lang.startsWith('en'));
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onend = () => {
          window.__activeUtterance = null;
        };

        utterance.onerror = (e) => {
          // Ignore interruption errors when canceled deliberately
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('[MinuteFit Voice] Speech error:', e);
          }
          window.__activeUtterance = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[MinuteFit Voice] Failed to speak:', err);
      }
    };

    if (options.delay && options.delay > 0) {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
      pendingTimeoutRef.current = setTimeout(executeSpeak, options.delay);
    } else {
      executeSpeak();
    }
  }, [enabled]);

  useEffect(() => {
    // Populate voice list
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }

    return () => {
      cancel();
    };
  }, [cancel]);

  return { speak, cancel };
};
