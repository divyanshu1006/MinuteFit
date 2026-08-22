import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useStreak } from '@/hooks/useStreak'
import { formatDate } from '@/utils/dates'
import { ArrowRight, Flame, Trophy, Clock, Sparkles, Dumbbell } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Home() {
  const navigate = useNavigate()
  const { getHistory, getTotalWorkouts, getLastWorkout } = useWorkoutHistory()
  const history = getHistory()
  const { currentStreak } = useStreak(history)
  const lastWorkout = getLastWorkout()
  const totalWorkouts = getTotalWorkouts()

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
    <div className="relative min-h-screen bg-gradient-to-br from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] text-[#143329] px-5 sm:px-8 pt-8 pb-32 md:pb-24 selection:bg-[#27B68C] selection:text-white flex flex-col justify-center">
      {/* Decorative ambient background orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-10 left-10 w-72 h-72 rounded-full bg-[#D4F2E6]/70 blur-3xl" />
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-[#FFE8DC]/60 blur-3xl" />
      </div>

      <motion.div
        className="max-w-md md:max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header Bar */}
        <motion.header variants={itemVariants} className="flex items-center justify-between mb-6 md:mb-10">
          <Logo size="md" />

          <div className="flex items-center gap-2">
            {currentStreak > 0 && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0E8] border border-[#FFE2D6] text-[#FF6E48] text-xs font-black shadow-xs">
                <Flame className="w-4 h-4 fill-current" />
                <span>{currentStreak} Day Streak</span>
              </div>
            )}
          </div>
        </motion.header>

        {/* Responsive Grid Layout (Single Column on Mobile, Two-Column on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
          
          {/* Left Column: Headline, Narrative, START Button & Quick Stats */}
          <div className="md:col-span-6 flex flex-col space-y-6">
            
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D5EFE3] text-xs font-bold text-[#27B68C] shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>One Fixed 20-Min Workout</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#143329] tracking-tight leading-[1.12]">
                20 Minutes.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D3E] via-[#27B68C] to-[#1E4D3E]">
                  Full Body Power.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#5E7A71] font-medium leading-relaxed max-w-lg">
                5 essential bodyweight exercises across 4 continuous rounds. Built for maximum consistency with spoken audio cues and no distractions.
              </p>
            </motion.div>

            {/* Primary START Button */}
            <motion.div variants={itemVariants} className="pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/workout')}
                className="w-full py-4.5 px-8 rounded-full bg-[#27B68C] hover:bg-[#20A07A] text-white font-black text-lg shadow-[0_14px_32px_rgba(39,182,140,0.38)] transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>START WORKOUT</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white stroke-[3]" />
                </div>
              </motion.button>
            </motion.div>

            {/* Glanceable Stats Card */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 rounded-[28px] bg-white/90 backdrop-blur-xl p-4 sm:p-5 border border-white/90 shadow-[0_10px_30px_rgba(20,55,42,0.04)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-2xl bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mb-1.5">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990]">Last Workout</span>
                <span className="text-xs sm:text-sm font-black text-[#143329] mt-0.5 truncate max-w-[90px]">
                  {lastWorkout ? formatDate(lastWorkout.date) : "None yet"}
                </span>
              </div>

              <div className="flex flex-col items-center text-center border-x border-[#E9F3EE]">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#FF7754] mb-1.5">
                  <Flame className="w-4.5 h-4.5 fill-current" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990]">Streak</span>
                <span className="text-xs sm:text-sm font-black text-[#143329] mt-0.5">
                  {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-2xl bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mb-1.5">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990]">Completed</span>
                <span className="text-xs sm:text-sm font-black text-[#143329] mt-0.5">
                  {totalWorkouts}
                </span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Graphic Card & Routine Breakdown */}
          <div className="md:col-span-6 flex flex-col space-y-6">
            
            {/* Arched Hero Graphic Card */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[32px] bg-white p-5 sm:p-6 border border-white/90 shadow-[0_16px_40px_rgba(20,55,42,0.06)]"
            >
              <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-[24px] overflow-hidden bg-[#D8EFE5] shadow-inner flex items-center justify-center">
                <img
                  src="/hero-mint.jpg"
                  alt="Fitness motivation"
                  className="w-full h-full object-cover object-center filter saturate-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#143329]/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-black tracking-wider uppercase bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-[#27B68C]" />
                    Full Bodyweight
                  </span>
                  <span className="text-xs font-black bg-[#27B68C] px-3.5 py-1.5 rounded-full shadow-sm">
                    4 Rounds
                  </span>
                </div>
              </div>

              {/* Quick Routine Snapshot */}
              <div className="mt-4 pt-3 border-t border-[#EEF6F2]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-[#143329]">Session Structure</span>
                  <span className="text-[11px] font-bold text-[#27B68C] bg-[#E3F5EE] px-2.5 py-0.5 rounded-full">
                    20 Min Total
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {['Push-ups', 'Pull-ups', 'Squats', 'Glute Bridges', 'Plank'].map((ex, i) => (
                    <span
                      key={ex}
                      className="text-[11px] font-semibold text-[#3C5A4F] bg-[#F1F8F4] px-3 py-1 rounded-xl border border-[#E1EEE7]"
                    >
                      {i + 1}. {ex}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </motion.div>
    </div>
  )
}
