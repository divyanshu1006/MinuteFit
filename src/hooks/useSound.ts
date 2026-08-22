import { useRef, useCallback, useEffect } from 'react';

export const useSound = (enabled: boolean) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initContext = useCallback(() => {
    if (!enabled) return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error('Web Audio API not supported', e);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', startTimeOffset = 0) => {
    const ctx = initContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTimeOffset);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime + startTimeOffset);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTimeOffset + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime + startTimeOffset);
    osc.stop(ctx.currentTime + startTimeOffset + duration);
  }, [initContext]);

  const playBeep = useCallback(() => {
    if (!enabled) return;
    playTone(880, 0.08, 'sine');
  }, [enabled, playTone]);

  const playTransition = useCallback(() => {
    if (!enabled) return;
    playTone(440, 0.15, 'triangle');
  }, [enabled, playTone]);

  const playComplete = useCallback(() => {
    if (!enabled) return;
    playTone(440, 0.15, 'sine', 0);
    playTone(660, 0.15, 'sine', 0.15);
    playTone(880, 0.15, 'sine', 0.3);
  }, [enabled, playTone]);

  return { playBeep, playTransition, playComplete };
};
