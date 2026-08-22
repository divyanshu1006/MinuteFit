import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutPhase, TimerState, Workout, Exercise } from '@/types/workout';

export const useWorkoutTimer = (
  workout: Workout,
  onPhaseChange?: (phase: WorkoutPhase, currentOrNextExerciseName: string) => void,
  onTick?: (remaining: number, phase: WorkoutPhase) => void,
  onComplete?: () => void
) => {
  const [timerState, setTimerState] = useState<TimerState>({
    phase: 'IDLE',
    currentRound: 1,
    currentExerciseIndex: 0,
    phaseRemaining: 0,
    totalElapsed: 0,
    totalRemaining: workout.duration,
    isPaused: false,
  });

  const stateRef = useRef({
    phase: 'IDLE' as WorkoutPhase,
    currentRound: 1,
    currentExerciseIndex: 0,
    phaseRemaining: 0,
    totalElapsed: 0,
    isPaused: false,
    
    phaseStartTimestamp: 0,
    phaseDuration: 0,
    pausedElapsed: 0,
    
    workoutStartTimestamp: 0,
    totalPausedDuration: 0,
    lastPauseTimestamp: 0,

    lastRenderTime: 0,
    lastTickEmitRemaining: -1
  });

  const reqRef = useRef<number>(0);
  const workoutRef = useRef(workout);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { workoutRef.current = workout; }, [workout]);
  useEffect(() => { onPhaseChangeRef.current = onPhaseChange; }, [onPhaseChange]);
  useEffect(() => { onTickRef.current = onTick; }, [onTick]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const advancePhase = useCallback(() => {
    const w = workoutRef.current;
    const s = stateRef.current;
    const ex = w.exercises[s.currentExerciseIndex];

    let nextPhase: WorkoutPhase = 'IDLE';
    let nextDuration = 0;
    let announcementName = '';
    
    if (s.phase === 'WORK') {
      // Check if it was the very last exercise of round 4
      if (s.currentExerciseIndex === w.exercises.length - 1 && s.currentRound === w.rounds) {
        nextPhase = 'COMPLETED';
        nextDuration = 0;
      } else {
        nextPhase = 'REST';
        nextDuration = ex.rest;
        // Determine the next exercise for announcement
        if (s.currentExerciseIndex < w.exercises.length - 1) {
          announcementName = w.exercises[s.currentExerciseIndex + 1].name;
        } else {
          announcementName = w.exercises[0].name;
        }
      }
    } else if (s.phase === 'REST') {
      nextPhase = 'WORK';
      if (s.currentExerciseIndex < w.exercises.length - 1) {
        s.currentExerciseIndex++;
      } else {
        s.currentExerciseIndex = 0;
        s.currentRound++;
      }
      const nextEx = w.exercises[s.currentExerciseIndex];
      nextDuration = nextEx.work;
      announcementName = nextEx.name;
    }

    s.phase = nextPhase;
    s.phaseDuration = nextDuration;
    s.phaseRemaining = nextDuration;
    s.phaseStartTimestamp = performance.now();
    s.pausedElapsed = 0;
    s.lastTickEmitRemaining = -1;

    setTimerState({
      phase: s.phase,
      currentRound: s.currentRound,
      currentExerciseIndex: s.currentExerciseIndex,
      phaseRemaining: s.phaseRemaining,
      totalElapsed: s.totalElapsed,
      totalRemaining: Math.max(0, w.duration - s.totalElapsed),
      isPaused: s.isPaused,
    });
    
    if (onPhaseChangeRef.current && s.phase !== 'COMPLETED' && s.phase !== 'IDLE') {
      onPhaseChangeRef.current(s.phase, announcementName);
    }
    
    if (s.phase === 'COMPLETED') {
      if (onCompleteRef.current) onCompleteRef.current();
    }
  }, []);

  const updateLoop = useCallback((time: number) => {
    const s = stateRef.current;
    const w = workoutRef.current;

    if (s.phase !== 'IDLE' && s.phase !== 'COMPLETED' && !s.isPaused) {
      const elapsed = (time - s.phaseStartTimestamp) / 1000;
      s.phaseRemaining = Math.max(0, s.phaseDuration - elapsed);

      const totalRawElapsed = (time - s.workoutStartTimestamp - s.totalPausedDuration) / 1000;
      s.totalElapsed = Math.min(w.duration, Math.max(0, totalRawElapsed));

      const roundedRemaining = Math.ceil(s.phaseRemaining);
      const currentPhase = s.phase as WorkoutPhase;

      if (s.phaseRemaining <= 0) {
        advancePhase();
      } else {
        if (roundedRemaining !== s.lastTickEmitRemaining && onTickRef.current && currentPhase !== 'COMPLETED') {
          onTickRef.current(roundedRemaining, currentPhase);
          s.lastTickEmitRemaining = roundedRemaining;
        }

        // Throttle state update to ~30fps for smooth UI without jitter
        if (time - s.lastRenderTime > 32) {
          setTimerState({
            phase: s.phase,
            currentRound: s.currentRound,
            currentExerciseIndex: s.currentExerciseIndex,
            phaseRemaining: s.phaseRemaining,
            totalElapsed: s.totalElapsed,
            totalRemaining: Math.max(0, w.duration - s.totalElapsed),
            isPaused: s.isPaused,
          });
          s.lastRenderTime = time;
        }
      }
    }

    if (s.phase !== 'COMPLETED') {
      reqRef.current = requestAnimationFrame(updateLoop);
    }
  }, [advancePhase]);

  const start = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== 'IDLE') return;

    const w = workoutRef.current;
    const firstEx = w.exercises[0];
    const now = performance.now();

    s.phase = 'WORK';
    s.phaseDuration = firstEx.work;
    s.phaseRemaining = firstEx.work;
    s.currentRound = 1;
    s.currentExerciseIndex = 0;
    s.phaseStartTimestamp = now;
    s.workoutStartTimestamp = now;
    s.totalPausedDuration = 0;
    s.pausedElapsed = 0;
    s.isPaused = false;
    s.lastTickEmitRemaining = -1;
    
    setTimerState({
      phase: 'WORK',
      currentRound: 1,
      currentExerciseIndex: 0,
      phaseRemaining: firstEx.work,
      totalElapsed: 0,
      totalRemaining: w.duration,
      isPaused: false,
    });

    if (onPhaseChangeRef.current) {
      onPhaseChangeRef.current('WORK', firstEx.name);
    }
    
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    reqRef.current = requestAnimationFrame(updateLoop);
  }, [updateLoop]);

  const pause = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === 'IDLE' || s.phase === 'COMPLETED' || s.isPaused) return;

    s.isPaused = true;
    const now = performance.now();
    s.pausedElapsed = now - s.phaseStartTimestamp;
    s.lastPauseTimestamp = now;

    setTimerState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    const s = stateRef.current;
    if (!s.isPaused) return;

    s.isPaused = false;
    const now = performance.now();
    s.phaseStartTimestamp = now - s.pausedElapsed;
    s.totalPausedDuration += (now - s.lastPauseTimestamp);
    
    setTimerState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const quit = useCallback(() => {
    const s = stateRef.current;
    s.phase = 'IDLE';
    s.currentRound = 1;
    s.currentExerciseIndex = 0;
    s.phaseRemaining = 0;
    s.totalElapsed = 0;
    s.isPaused = false;
    
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    
    setTimerState({
      phase: 'IDLE',
      currentRound: 1,
      currentExerciseIndex: 0,
      phaseRemaining: 0,
      totalElapsed: 0,
      totalRemaining: workoutRef.current.duration,
      isPaused: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  const currentExercise = workout.exercises[timerState.currentExerciseIndex];
  
  let nextExercise: Exercise | null = null;
  if (timerState.currentExerciseIndex < workout.exercises.length - 1) {
    nextExercise = workout.exercises[timerState.currentExerciseIndex + 1];
  } else if (timerState.currentRound < workout.rounds) {
    nextExercise = workout.exercises[0];
  }

  const progress = workout.duration > 0 ? Math.min(1, timerState.totalElapsed / workout.duration) : 0;

  return {
    timerState,
    start,
    pause,
    resume,
    quit,
    currentExercise,
    nextExercise,
    progress
  };
};
