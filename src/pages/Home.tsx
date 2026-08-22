import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useStreak } from '@/hooks/useStreak'
import { formatDate } from '@/utils/dates'
import { ArrowRight, Flame, Trophy, Clock, Sparkles } from 'lucide-react'

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
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] text-[#143329] px-5 pt-8 pb-28 selection:bg-[#27B68C] selection:text-white">
      <motion.div
        className="max-w-md mx-auto flex flex-col space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header Bar */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#27B68C]/15 border border-[#27B68C]/30 flex items-center justify-center text-[#27B68C] font-black text-sm shadow-sm">
              20
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#68857B]">MinuteFit</p>
              <h2 className="text-sm font-extrabold text-[#143329]">Daily Companion</h2>
            </div>
          </div>

          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0E8] border border-[#FFE2D6] text-[#FF6E48] text-xs font-black shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{currentStreak} Day Streak</span>
            </div>
          )}
        </motion.div>

        {/* Hero Banner Card with Arched Illustration Frame */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-[#F8FCFA] to-[#EAF6F0] p-6 border border-white/80 shadow-[0_16px_40px_rgba(20,55,42,0.06)]"
        >
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-[#D4F2E6]/60 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-[#FFEAE0]/60 blur-2xl pointer-events-none" />

          {/* Arched Hero Graphic */}
          <div className="relative w-full h-56 rounded-[24px] overflow-hidden bg-[#D8EFE5] mb-5 shadow-inner flex items-center justify-center">
            <img
              src="/hero-mint.jpg"
              alt="Fitness motivation"
              className="w-full h-full object-cover object-center filter saturate-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#143329]/40 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <span className="text-xs font-black tracking-wider uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Full Bodyweight
              </span>
              <span className="text-xs font-bold bg-[#27B68C] px-3 py-1 rounded-full shadow-sm">
                20 Min
              </span>
            </div>
          </div>

          {/* Headline and Narrative */}
          <div className="space-y-1.5 mb-5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#143329] tracking-tight leading-tight">
              20 Minutes.<br />Pure Focus.
            </h1>
            <p className="text-xs text-[#5E7A71] font-medium leading-relaxed">
              5 exercises, 4 rounds. Spoken audio guidance and zero distractions.
            </p>
          </div>

          {/* Primary Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/workout')}
            className="w-full py-4 px-6 rounded-full bg-[#27B68C] hover:bg-[#22A57E] text-white font-extrabold text-base shadow-[0_12px_28px_rgba(39,182,140,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>START WORKOUT</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </motion.button>
        </motion.div>

        {/* Workout Breakdown Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-[28px] bg-white p-5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#27B68C]" />
              <h3 className="text-sm font-extrabold text-[#143329]">Session Structure</h3>
            </div>
            <span className="text-[11px] font-bold text-[#27B68C] bg-[#E3F5EE] px-2.5 py-0.5 rounded-full">
              Fixed Routine
            </span>
          </div>

          {/* 3 Pills Overview */}
          <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
            <div className="rounded-2xl bg-[#F4FAF7] p-3 border border-[#E6F3ED]">
              <span className="block text-lg font-black text-[#143329]">20</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#68857B]">Minutes</span>
            </div>
            <div className="rounded-2xl bg-[#F4FAF7] p-3 border border-[#E6F3ED]">
              <span className="block text-lg font-black text-[#143329]">5</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#68857B]">Exercises</span>
            </div>
            <div className="rounded-2xl bg-[#F4FAF7] p-3 border border-[#E6F3ED]">
              <span className="block text-lg font-black text-[#143329]">4</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#68857B]">Rounds</span>
            </div>
          </div>

          {/* Exercise List Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['Push-ups', 'Pull-ups', 'Squats', 'Glute Bridges', 'Plank'].map((ex, i) => (
              <span
                key={ex}
                className="text-[11px] font-semibold text-[#426156] bg-[#F1F7F4] px-3 py-1 rounded-xl border border-[#E1EEE7]"
              >
                {i + 1}. {ex}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Minimal Progress / Stats Card */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-3 rounded-[24px] bg-white/80 backdrop-blur-md p-4 border border-white shadow-[0_8px_24px_rgba(20,55,42,0.03)]"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990]">Last Workout</span>
            <span className="text-xs font-black text-[#143329] mt-0.5 truncate max-w-[85px]">
              {lastWorkout ? formatDate(lastWorkout.date) : "None yet"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center border-x border-[#E9F3EE]">
            <div className="w-8 h-8 rounded-full bg-[#FFF0E8] flex items-center justify-center text-[#FF7754] mb-1.5">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990]">Streak</span>
            <span className="text-xs font-black text-[#143329] mt-0.5">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mb-1.5">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990]">Completed</span>
            <span className="text-xs font-black text-[#143329] mt-0.5">
              {totalWorkouts}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
