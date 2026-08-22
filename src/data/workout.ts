import type { Workout } from '@/types/workout'

export const workout: Workout = {
  name: 'Twenty',
  duration: 20 * 60, // 1200 seconds
  rounds: 4,
  exercises: [
    {
      name: 'Push-ups',
      work: 40,
      rest: 20,
      instruction: 'Keep your body straight. Lower with control. Push the floor away.',
    },
    {
      name: 'Pull-ups',
      work: 40,
      rest: 20,
      instruction: 'Start from a controlled hang. Pull your chest toward the bar.',
    },
    {
      name: 'Bodyweight Squats',
      work: 40,
      rest: 20,
      instruction: 'Keep your chest tall. Sit down and drive through your feet.',
    },
    {
      name: 'Glute Bridges',
      work: 40,
      rest: 20,
      instruction: 'Drive through your feet and squeeze your glutes at the top.',
    },
    {
      name: 'Plank',
      work: 40,
      rest: 20,
      instruction: 'Keep your body straight and brace your core.',
    },
  ],
}

// Per-round duration: 5 exercises × (40s work + 20s rest) = 300s = 5 min
// Total: 4 rounds × 300s = 1200s = 20 min
