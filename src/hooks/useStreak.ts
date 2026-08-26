import { useMemo } from 'react';
import { WorkoutLog } from '@/types/workout';
import { getLocalDateString, isToday, isYesterday } from '@/utils/dates';

export interface StreakInfo {
  currentStreak: number;
  isRestDay: boolean;
  cycleDay: number; // 1, 2, 3 (Work) or 4 (Scheduled Rest)
  consecutiveWorkoutsInCurrentBlock: number;
}

export const useStreak = (history: WorkoutLog[]): StreakInfo => {
  return useMemo(() => {
    if (!history || history.length === 0) {
      return {
        currentStreak: 0,
        isRestDay: false,
        cycleDay: 1,
        consecutiveWorkoutsInCurrentBlock: 0
      };
    }

    const completedDates = history
      .filter(log => log.completed)
      .map(log => log.date || getLocalDateString(new Date(log.timestamp)));
      
    const uniqueDates = Array.from(new Set(completedDates)).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    if (uniqueDates.length === 0) {
      return {
        currentStreak: 0,
        isRestDay: false,
        cycleDay: 1,
        consecutiveWorkoutsInCurrentBlock: 0
      };
    }

    const todayStr = getLocalDateString();
    const hasWorkedOutToday = uniqueDates.includes(todayStr);

    let streak = 0;
    
    // Check start date for streak calculation
    if (isToday(uniqueDates[0])) {
      streak = 1;
    } else if (isYesterday(uniqueDates[0])) {
      streak = 1;
    } else {
      // Check if yesterday was a scheduled 4th rest day and day before was active
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = getLocalDateString(twoDaysAgo);

      if (uniqueDates[0] === twoDaysAgoStr) {
        // Check if there were 3 consecutive workout days before that
        let tempStreak = 1;
        let testDate = new Date(twoDaysAgo);
        for (let i = 1; i < uniqueDates.length; i++) {
          const expected = new Date(testDate);
          expected.setDate(expected.getDate() - 1);
          if (uniqueDates[i] === getLocalDateString(expected)) {
            tempStreak++;
            testDate = expected;
          } else {
            break;
          }
        }
        if (tempStreak % 4 === 3) {
          // Yesterday was an authorized rest day! Streak preserved.
          streak = tempStreak;
        } else {
          return {
            currentStreak: 0,
            isRestDay: false,
            cycleDay: 1,
            consecutiveWorkoutsInCurrentBlock: 0
          };
        }
      } else {
        return {
          currentStreak: 0,
          isRestDay: false,
          cycleDay: 1,
          consecutiveWorkoutsInCurrentBlock: 0
        };
      }
    }

    // Accumulate consecutive dates
    let currentDate = new Date(uniqueDates[0]);
    for (let i = 1; i < uniqueDates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      
      if (uniqueDates[i] === getLocalDateString(expectedDate)) {
        streak++;
        currentDate = expectedDate;
      } else {
        // Check if the missing day was a scheduled 4th rest day
        const skipRestDate = new Date(currentDate);
        skipRestDate.setDate(skipRestDate.getDate() - 2);
        if (uniqueDates[i] === getLocalDateString(skipRestDate) && streak % 4 === 3) {
          // Permitted rest day in streak!
          currentDate = skipRestDate;
          streak++;
        } else {
          break;
        }
      }
    }

    // Determine if today is a scheduled 4th-day Rest Day (3 consecutive workout days completed)
    // If user worked out 3 days in a row (e.g. yesterday completed 3rd in row, or streak % 4 === 3)
    let isRestDay = false;
    let cycleDay = 1;
    let consecutiveWorkoutsInCurrentBlock = 0;

    if (hasWorkedOutToday) {
      consecutiveWorkoutsInCurrentBlock = ((streak - 1) % 4) + 1;
      cycleDay = consecutiveWorkoutsInCurrentBlock;
    } else {
      // Haven't worked out yet today
      const consecutiveDays = streak % 4;
      if (consecutiveDays === 3) {
        // 3 consecutive days done! Today is the 4th day -> REST DAY
        isRestDay = true;
        cycleDay = 4;
        consecutiveWorkoutsInCurrentBlock = 3;
      } else {
        consecutiveWorkoutsInCurrentBlock = consecutiveDays;
        cycleDay = consecutiveDays + 1;
      }
    }

    return {
      currentStreak: streak,
      isRestDay,
      cycleDay,
      consecutiveWorkoutsInCurrentBlock
    };
  }, [history]);
};
