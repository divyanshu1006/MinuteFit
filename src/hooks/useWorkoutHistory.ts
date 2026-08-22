import { useState, useCallback } from 'react';
import { WorkoutLog } from '@/types/workout';
import { loadFromStorage, saveToStorage, removeFromStorage } from '@/utils/persistence';
import { generateId } from '@/utils/dates';

export const useWorkoutHistory = () => {
  const [history, setHistory] = useState<WorkoutLog[]>(() => {
    return loadFromStorage<WorkoutLog[]>('history', []);
  });

  const addWorkout = useCallback((log: Omit<WorkoutLog, 'id'>) => {
    setHistory((prev) => {
      const newLog = { ...log, id: generateId() };
      const newHistory = [newLog, ...prev].sort((a, b) => b.timestamp - a.timestamp);
      saveToStorage('history', newHistory);
      return newHistory;
    });
  }, []);

  const getHistory = useCallback(() => history, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    removeFromStorage('history');
  }, []);

  const getLastWorkout = useCallback(() => {
    return history.length > 0 ? history[0] : null;
  }, [history]);

  const getTotalWorkouts = useCallback(() => {
    return history.filter(w => w.completed).length;
  }, [history]);

  const getTotalMinutes = useCallback(() => {
    return Math.floor(history.filter(w => w.completed).reduce((acc, curr) => acc + curr.duration, 0) / 60);
  }, [history]);

  return {
    history,
    addWorkout,
    getHistory,
    clearHistory,
    getLastWorkout,
    getTotalWorkouts,
    getTotalMinutes
  };
};
