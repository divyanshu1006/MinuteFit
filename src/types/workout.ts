// ─── Workout Phase ───
export type WorkoutPhase = 'IDLE' | 'COUNTDOWN' | 'WORK' | 'REST' | 'PAUSED' | 'COMPLETED'

export type Difficulty = 'easy' | 'good' | 'hard'

// ─── Exercise Definition ───
export interface Exercise {
  name: string
  work: number   // seconds
  rest: number   // seconds
  instruction: string
}

// ─── Workout Definition ───
export interface Workout {
  name: string
  duration: number  // total seconds
  rounds: number
  exercises: Exercise[]
}

// ─── Timer State ───
export interface TimerState {
  phase: WorkoutPhase
  currentRound: number       // 1-based
  currentExerciseIndex: number  // 0-based
  phaseRemaining: number     // seconds remaining in current phase
  totalElapsed: number       // seconds elapsed in entire workout
  totalRemaining: number     // seconds remaining in entire workout
  isPaused: boolean
}

// ─── Workout Log Entry ───
export interface WorkoutLog {
  id: string
  date: string              // ISO date string (YYYY-MM-DD)
  timestamp: number         // Unix timestamp
  duration: number          // seconds
  completed: boolean
  rounds: number
  exercises: number
  difficulty: Difficulty
}

// ─── Settings ───
export interface AppSettings {
  voiceEnabled: boolean
  soundEnabled: boolean
  theme: 'light' | 'dark' | 'system'
}
