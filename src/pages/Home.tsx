import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useStreak } from '@/hooks/useStreak'
import { formatDate } from '@/utils/dates'
import { workout } from '@/data/workout'
import { 
  ArrowRight, 
  Flame, 
  Trophy, 
  Clock, 
  Sparkles, 
  Dumbbell, 
  Volume2, 
  Timer, 
  ShieldCheck, 
  ChevronRight,
  Info,
  HeartPulse,
  Coffee,
  CheckCircle2
} from 'lucide-react'
import Logo from '@/components/Logo'

export default function Home() {
  const navigate = useNavigate()
  const { getHistory, getTotalWorkouts, getLastWorkout } = useWorkoutHistory()
  const history = getHistory()
  const { currentStreak, isRestDay, cycleDay, consecutiveWorkoutsInCurrentBlock } = useStreak(history)
  const lastWorkout = getLastWorkout()
  const totalWorkouts = getTotalWorkouts()
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] dark:from-[#0B1A15] dark:via-[#0F221B] dark:to-[#122A21] text-[#143329] dark:text-[#E8F4F0] px-4 sm:px-8 pt-6 sm:pt-8 pb-32 md:pb-24 selection:bg-[#27B68C] selection:text-white flex flex-col justify-center transition-colors duration-200">
      {/* Decorative ambient background orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-10 left-10 w-72 h-72 rounded-full bg-[#D4F2E6]/70 dark:bg-[#27B68C]/15 blur-3xl" />
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-[#FFE8DC]/60 dark:bg-[#FF7754]/10 blur-3xl" />
      </div>

      <motion.div
        className="max-w-md md:max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header Bar */}
        <motion.header variants={itemVariants} className="flex items-center justify-between mb-5 md:mb-8">
          <Logo size="md" />

          <div className="flex items-center gap-2">
            {currentStreak > 0 ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E8] dark:bg-[#38231C] border border-[#FFE2D6] dark:border-[#523328] text-[#FF6E48] text-xs font-black shadow-xs">
                <Flame className="w-4 h-4 fill-current animate-pulse" />
                <span>{currentStreak} Day Streak</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-[#142A21] border border-[#D5EFE3] dark:border-[#234537] text-[#27B68C] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Day 1 Ready</span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* Left Column: Value Prop, CTA & Quick Stats */}
          <div className="md:col-span-6 flex flex-col space-y-5 sm:space-y-6">
            
            <motion.div variants={itemVariants} className="space-y-2.5">
              {/* 4-Day Rhythm Badge (3 Days On, 1 Day Rest) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#142A21]/90 backdrop-blur-md border border-[#D5EFE3] dark:border-[#234537] text-xs font-bold text-[#27B68C] shadow-xs">
                {isRestDay ? (
                  <>
                    <Coffee className="w-3.5 h-3.5 text-[#27B68C]" />
                    <span>Day 4 • Scheduled Rest & Recovery</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Day {cycleDay} of 4 • 3 Days Work, 1 Day Rest</span>
                  </>
                )}
              </div>

              {isRestDay ? (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#143329] dark:text-white tracking-tight leading-[1.12]">
                    3 Days Done.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27B68C] via-[#2DD4A3] to-[#27B68C]">
                      Recovery Day.
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-[#5E7A71] dark:text-[#94B3A8] font-medium leading-relaxed max-w-lg">
                    You crushed 3 consecutive workout days! Muscles rebuild and grow during recovery. Take today off to recharge — your streak remains 100% active and protected.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#143329] dark:text-white tracking-tight leading-[1.12]">
                    20 Minutes.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D3E] via-[#27B68C] to-[#1E4D3E] dark:from-[#2DD4A3] dark:via-[#27B68C] dark:to-[#4EF0C1]">
                      Full Body Power.
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-[#5E7A71] dark:text-[#94B3A8] font-medium leading-relaxed max-w-lg">
                    5 proven bodyweight movements across 4 continuous rounds. Just press start — spoken voice guidance lets you focus completely on your form without watching the screen.
                  </p>
                </>
              )}
            </motion.div>

            {/* Primary Action Section */}
            <motion.div variants={itemVariants} className="pt-1 flex flex-col gap-3">
              {isRestDay ? (
                <div className="space-y-2.5">
                  <div className="w-full py-4.5 px-6 rounded-3xl bg-[#EBF7F2] dark:bg-[#152E24] border border-[#CDEEE0] dark:border-[#234F3C] text-[#1E6852] dark:text-[#32D2A2] flex items-center justify-center gap-3 shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-[#27B68C] shrink-0" />
                    <span className="font-extrabold text-sm sm:text-base">Enjoy your rest day! Streak is safe.</span>
                  </div>

                  <button
                    onClick={() => navigate('/workout')}
                    className="w-full py-3 px-4 rounded-full bg-white dark:bg-[#142A21] hover:bg-[#F2FAF6] dark:hover:bg-[#183429] text-[#27B68C] font-bold text-xs uppercase tracking-wider border border-[#D5EFE3] dark:border-[#234537] transition-all cursor-pointer text-center"
                  >
                    Want to train anyway? Start Workout
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/workout')}
                  className="w-full py-4.5 px-8 rounded-full bg-[#27B68C] hover:bg-[#20A07A] text-white font-black text-lg shadow-[0_14px_32px_rgba(39,182,140,0.38)] transition-all flex items-center justify-center gap-3 group cursor-pointer"
                  aria-label="Start 20-minute daily workout"
                >
                  <span>START 20-MIN WORKOUT</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                </motion.button>
              )}

              {/* Psychological Friction Reducers */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#5B7B70] dark:text-[#8EA89E]">
                  <Volume2 className="w-3.5 h-3.5 text-[#27B68C] shrink-0" />
                  <span>Voice Cues</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#5B7B70] dark:text-[#8EA89E]">
                  <Timer className="w-3.5 h-3.5 text-[#27B68C] shrink-0" />
                  <span>40s / 20s Rest</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#5B7B70] dark:text-[#8EA89E]">
                  <HeartPulse className="w-3.5 h-3.5 text-[#27B68C] shrink-0" />
                  <span>3 Work : 1 Rest</span>
                </div>
              </div>
            </motion.div>

            {/* Glanceable Progress & Habit Stats Card */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 sm:gap-3 rounded-[28px] bg-white/90 dark:bg-[#142A21]/90 backdrop-blur-xl p-4 sm:p-5 border border-white/90 dark:border-[#234537] shadow-[0_10px_30px_rgba(20,55,42,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-2xl bg-[#EBF7F2] dark:bg-[#1C382D] flex items-center justify-center text-[#27B68C] mb-1.5">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990] dark:text-[#7C9B90]">Last Workout</span>
                <span className="text-xs sm:text-sm font-black text-[#143329] dark:text-white mt-0.5 truncate max-w-[95px]">
                  {lastWorkout ? formatDate(lastWorkout.date) : "First Session"}
                </span>
              </div>

              <div className="flex flex-col items-center text-center border-x border-[#E9F3EE] dark:border-[#234537]">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF0E8] dark:bg-[#38231C] flex items-center justify-center text-[#FF7754] mb-1.5">
                  <Flame className="w-4.5 h-4.5 fill-current" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990] dark:text-[#7C9B90]">Current Streak</span>
                <span className="text-xs sm:text-sm font-black text-[#143329] dark:text-white mt-0.5">
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-2xl bg-[#EBF7F2] dark:bg-[#1C382D] flex items-center justify-center text-[#27B68C] mb-1.5">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990] dark:text-[#7C9B90]">Completed</span>
                <span className="text-xs sm:text-sm font-black text-[#143329] dark:text-white mt-0.5">
                  {totalWorkouts} {totalWorkouts === 1 ? 'time' : 'times'}
                </span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual & Transparent Routine Breakdown */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            
            {/* Visual Card */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[32px] bg-white dark:bg-[#142A21] p-4 sm:p-6 border border-white/90 dark:border-[#234537] shadow-[0_16px_40px_rgba(20,55,42,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-[22px] overflow-hidden bg-[#D8EFE5] dark:bg-[#10241C] shadow-inner flex items-center justify-center">
                <img
                  src="/hero-mint.jpg"
                  alt="Fitness motivation"
                  className="w-full h-full object-cover object-center filter saturate-105"
                  onError={(e) => {
                    // Graceful fallback if image is missing
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#143329]/70 via-[#143329]/20 to-transparent" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[11px] font-extrabold tracking-wider uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-[#27B68C]" />
                    Full Bodyweight
                  </span>
                  <span className="text-[11px] font-extrabold bg-[#27B68C] text-white px-3 py-1 rounded-full shadow-sm">
                    4 Rounds • 20 Min
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold text-white/90 drop-shadow-sm">
                    5 balanced movements designed to hit push, pull, legs, posterior chain, and core.
                  </p>
                </div>
              </div>

              {/* Routine Transparency List */}
              <div className="mt-4 pt-3 border-t border-[#EEF6F2] dark:border-[#234537]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black text-[#143329] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#27B68C]" />
                    Today's 5 Exercises
                  </span>
                  <span className="text-[11px] font-bold text-[#5E7A71] dark:text-[#8EA89E]">
                    Tap to preview cues
                  </span>
                </div>

                <div className="space-y-1.5">
                  {workout.exercises.map((ex, i) => {
                    const isSelected = selectedExerciseIndex === i
                    return (
                      <div key={ex.name} className="flex flex-col">
                        <button
                          onClick={() => setSelectedExerciseIndex(isSelected ? null : i)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                            isSelected 
                              ? 'bg-[#EAF7F1] dark:bg-[#1C382D] border-[#27B68C] text-[#143329] dark:text-white shadow-2xs' 
                              : 'bg-[#F6FAF8] dark:bg-[#12241D] hover:bg-[#EEF6F2] dark:hover:bg-[#183127] border-[#E5EFEA] dark:border-[#234537] text-[#344E44] dark:text-[#C6E2D8]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white dark:bg-[#183127] text-[#27B68C] text-[11px] font-black flex items-center justify-center shadow-2xs border border-[#D7ECE2] dark:border-[#2B5443]">
                              {i + 1}
                            </span>
                            <span className="text-xs font-bold text-[#143329] dark:text-white">
                              {ex.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-[#658277] dark:text-[#8EA89E]">
                              {ex.work}s / {ex.rest}s rest
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 text-[#88A398] dark:text-[#6E8E82] transition-transform duration-200 ${isSelected ? 'rotate-90 text-[#27B68C]' : ''}`} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3.5 py-2.5 my-1.5 rounded-xl bg-white dark:bg-[#10221B] border border-[#D5EFE3] dark:border-[#234537] text-xs text-[#48665B] dark:text-[#A7C7BB] leading-relaxed shadow-2xs flex items-start gap-2">
                                <span className="text-[#27B68C] font-bold shrink-0">Cue:</span>
                                <span>{ex.instruction}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </motion.div>
    </div>
  )
}
