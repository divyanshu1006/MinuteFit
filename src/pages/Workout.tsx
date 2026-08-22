import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Pause, Play, X } from 'lucide-react'
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer'
import { useSound } from '@/hooks/useSound'
import { useSpeech } from '@/hooks/useSpeech'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useStreak } from '@/hooks/useStreak'
import { useSettings } from '@/hooks/useSettings'
import { workout } from '@/data/workout'
import type { Difficulty, WorkoutPhase } from '@/types/workout'
import { getLocalDateString } from '@/utils/dates'
import Timer from '@/components/Timer'
import Countdown from '@/components/Countdown'
import ExerciseHeader from '@/components/ExerciseHeader'
import ProgressBar from '@/components/ProgressBar'
import WorkoutInfo from '@/components/WorkoutInfo'
import CompletionScreen from '@/components/CompletionScreen'
import QuitDialog from '@/components/QuitDialog'

export default function Workout() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { playBeep, playTransition, playComplete } = useSound(settings.soundEnabled)
  const { speak, cancel: cancelSpeech } = useSpeech(settings.voiceEnabled)
  const { addWorkout, getHistory, getTotalWorkouts } = useWorkoutHistory()
  const history = getHistory()
  const { currentStreak } = useStreak(history)
  const totalWorkouts = getTotalWorkouts()
  
  const [showQuit, setShowQuit] = useState(false)
  const [internalPhase, setInternalPhase] = useState<'COUNTDOWN' | 'ACTIVE' | 'COMPLETED'>('COUNTDOWN')

  const handlePhaseChange = useCallback((phase: WorkoutPhase, exerciseOrNextName: string) => {
    if (phase === 'WORK') {
      playTransition()
      speak(`Start. ${exerciseOrNextName}`)
    } else if (phase === 'REST') {
      playTransition()
      if (exerciseOrNextName) {
        speak(`Rest. Next: ${exerciseOrNextName}`)
      } else {
        speak("Rest")
      }
    }
  }, [playTransition, speak])

  const handleTick = useCallback((remaining: number, phase: WorkoutPhase) => {
    if (phase === 'WORK') {
      if (remaining === 10) {
        speak("10 seconds")
      } else if (remaining === 5) {
        speak("5")
      } else if (remaining === 4) {
        speak("4")
      } else if (remaining === 3) {
        playBeep()
        speak("3")
      } else if (remaining === 2) {
        playBeep()
        speak("2")
      } else if (remaining === 1) {
        playBeep()
        speak("1")
      }
    } else if (phase === 'REST') {
      if (remaining === 3) {
        playBeep()
        speak("3")
      } else if (remaining === 2) {
        playBeep()
        speak("2")
      } else if (remaining === 1) {
        playBeep()
        speak("1")
      }
    }
  }, [playBeep, speak])

  const handleComplete = useCallback(() => {
    setInternalPhase('COMPLETED')
    playComplete()
    speak("Workout complete. Twenty minutes done.")
  }, [playComplete, speak])

  const timer = useWorkoutTimer(
    workout,
    handlePhaseChange,
    handleTick,
    handleComplete
  )

  useEffect(() => {
    return () => {
      cancelSpeech()
    }
  }, [cancelSpeech])

  const handleCountdownComplete = () => {
    setInternalPhase('ACTIVE')
    timer.start()
  }

  const handleLog = (difficulty: Difficulty) => {
    addWorkout({
      date: getLocalDateString(),
      timestamp: Date.now(),
      duration: workout.duration,
      completed: true,
      rounds: workout.rounds,
      exercises: workout.exercises.length,
      difficulty
    })
  }

  const handleDone = () => {
    navigate('/')
  }

  if (internalPhase === 'COUNTDOWN') {
    return (
      <Countdown 
        exerciseName={workout.exercises[0].name}
        onComplete={handleCountdownComplete} 
        onBeep={playBeep}
        speak={speak}
      />
    )
  }

  if (internalPhase === 'COMPLETED') {
    return (
      <CompletionScreen 
        onLog={handleLog} 
        onDone={handleDone} 
        streak={currentStreak} 
        totalWorkouts={totalWorkouts} 
      />
    )
  }

  const { phase, currentRound, currentExerciseIndex, isPaused } = timer.timerState
  
  return (
    <div className="min-h-screen bg-[#0E1F19] text-white flex flex-col justify-between select-none pb-safe">
      {/* Top Total Progress Bar */}
      <div className="pt-3 px-5">
        <ProgressBar progress={timer.progress} phase={phase} />
      </div>
      
      <div className="flex-1 flex flex-col justify-around px-6 py-4 max-w-lg mx-auto w-full">
        {/* Exercise Header */}
        <ExerciseHeader 
          exercise={timer.currentExercise} 
          nextExercise={timer.nextExercise}
          phase={phase} 
        />
        
        {/* Main Digital Timer */}
        <div className="flex items-center justify-center my-2">
          <Timer seconds={timer.timerState.phaseRemaining} phase={phase} />
        </div>

        {/* Workout Round/Exercise & Next Info */}
        <WorkoutInfo 
          currentRound={currentRound} 
          totalRounds={workout.rounds} 
          currentExerciseIndex={currentExerciseIndex} 
          totalExercises={workout.exercises.length} 
          nextExerciseName={timer.nextExercise?.name || null} 
          phase={phase} 
        />

        {/* Controls */}
        <div className="flex justify-center items-center gap-6 mt-4">
          <button 
            onClick={() => isPaused ? timer.resume() : timer.pause()}
            aria-label={isPaused ? "Resume workout" : "Pause workout"}
            className="w-16 h-16 rounded-full bg-[#183127] border border-[#234537] flex items-center justify-center text-white active:scale-95 transition-transform hover:bg-[#1E3E32] shadow-lg cursor-pointer"
          >
            {isPaused ? <Play className="w-7 h-7 ml-0.5 fill-current text-[#27B68C]" /> : <Pause className="w-7 h-7 fill-current text-white" />}
          </button>
          
          <button 
            onClick={() => { timer.pause(); setShowQuit(true) }}
            aria-label="Quit workout"
            className="w-16 h-16 rounded-full bg-[#183127] border border-[#234537] flex items-center justify-center text-[#8EA89E] hover:text-rose-400 active:scale-95 transition-transform cursor-pointer shadow-lg"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Paused Overlay */}
      <AnimatePresence>
        {isPaused && !showQuit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A1612]/90 backdrop-blur-md flex flex-col items-center justify-center z-40 p-6"
          >
            <h2 className="text-5xl font-black mb-8 tracking-widest text-white">PAUSED</h2>
            <button 
              onClick={() => timer.resume()}
              className="px-14 py-4 bg-[#27B68C] text-white rounded-full text-lg font-black shadow-[0_12px_32px_rgba(39,182,140,0.4)] active:scale-95 transition-transform cursor-pointer"
            >
              RESUME
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quit Dialog */}
      <QuitDialog 
        open={showQuit} 
        onCancel={() => setShowQuit(false)} 
        onQuit={() => { timer.quit(); navigate('/') }} 
      />
    </div>
  )
}
