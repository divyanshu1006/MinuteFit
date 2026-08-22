import { useMemo } from 'react';
import { WorkoutLog } from '@/types/workout';
import { getLocalDateString, isToday, isYesterday } from '@/utils/dates';

export const useStreak = (history: WorkoutLog[]) => {
  const currentStreak = useMemo(() => {
    if (!history || history.length === 0) return 0;

    const completedDates = history
      .filter(log => log.completed)
      .map(log => log.date || getLocalDateString(new Date(log.timestamp)));
      
    const uniqueDates = Array.from(new Set(completedDates)).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    
    if (isToday(uniqueDates[0])) {
      streak = 1;
    } else if (isYesterday(uniqueDates[0])) {
      streak = 1;
    } else {
      return 0;
    }

    let currentDate = new Date(uniqueDates[0]);

    for (let i = 1; i < uniqueDates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      
      if (uniqueDates[i] === getLocalDateString(expectedDate)) {
        streak++;
        currentDate = expectedDate;
      } else {
        break;
      }
    }

    return streak;
  }, [history]);

  return { currentStreak };
};
