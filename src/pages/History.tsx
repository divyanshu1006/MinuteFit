import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { 
  Check, 
  Calendar, 
  Clock, 
  Trophy, 
  Flame, 
  ArrowRight, 
  Dumbbell, 
  Sparkles,
  Zap
} from 'lucide-react'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useStreak } from '@/hooks/useStreak'
import { formatDate, getLocalDateString } from '@/utils/dates'
import Logo from '@/components/Logo'

export default function History() {
  const navigate = useNavigate()
  const { getHistory, getTotalWorkouts, getTotalMinutes } = useWorkoutHistory()
  const history = getHistory()
  const { currentStreak } = useStreak(history)
  const totalWorkouts = getTotalWorkouts()
  const totalMinutes = getTotalMinutes()

  // Generate past 7 days for the consistency strip
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = getLocalDateString(d)
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'narrow' })
    const dayNumber = d.getDate()
    const hasWorkout = history.some(log => log.completed && (log.date === dateStr || getLocalDateString(new Date(log.timestamp)) === dateStr))
    const isToday = i === 6
    return { dateStr, dayLabel, dayNumber, hasWorkout, isToday }
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] text-[#143329] px-5 pt-8 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#68857B]">Progress & Consistency</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#143329] tracking-tight">Workout History</h1>
          </div>
          <Logo size="sm" showText={false} />
        </div>

        {/* 3-Pillar Progress Summary */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-white p-3.5 border border-white/80 shadow-[0_6px_20px_rgba(20,55,42,0.03)] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mb-1.5">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#7E9990]">Completed</span>
            <span className="text-sm font-black text-[#143329] mt-0.5">{totalWorkouts}</span>
          </div>

          <div className="rounded-2xl bg-white p-3.5 border border-white/80 shadow-[0_6px_20px_rgba(20,55,42,0.03)] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0E8] flex items-center justify-center text-[#FF7754] mb-1.5">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#7E9990]">Streak</span>
            <span className="text-sm font-black text-[#143329] mt-0.5">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
          </div>

          <div className="rounded-2xl bg-white p-3.5 border border-white/80 shadow-[0_6px_20px_rgba(20,55,42,0.03)] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#7E9990]">Time</span>
            <span className="text-sm font-black text-[#143329] mt-0.5">{totalMinutes}m</span>
          </div>
        </div>

        {/* 7-Day Consistency Visual Tracker */}
        <div className="rounded-[28px] bg-white p-4.5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#143329] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#27B68C]" />
              Last 7 Days
            </span>
            <span className="text-[11px] font-bold text-[#68857B]">
              Consistency Habit
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {past7Days.map((d) => (
              <div 
                key={d.dateStr}
                className={`flex flex-col items-center py-2 px-1 rounded-2xl border transition-all ${
                  d.hasWorkout 
                    ? 'bg-[#EAF7F1] border-[#27B68C] text-[#143329]' 
                    : d.isToday
                    ? 'bg-white border-[#27B68C]/40 text-[#68857B]'
                    : 'bg-[#F7FAF9] border-[#E8F2ED] text-[#8DA69D]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{d.dayLabel}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center mt-1.5 font-black text-xs ${
                  d.hasWorkout 
                    ? 'bg-[#27B68C] text-white shadow-2xs' 
                    : d.isToday
                    ? 'bg-[#E3EFE9] text-[#143329]'
                    : 'text-[#68857B]'
                }`}>
                  {d.hasWorkout ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : d.dayNumber}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History List or Welcoming Empty State */}
        {history.length === 0 ? (
          <div className="text-center py-10 px-6 rounded-[28px] bg-white/90 border border-white shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF7F2] border border-[#D7EFE4] flex items-center justify-center text-[#27B68C] mx-auto shadow-xs">
              <Calendar className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-black text-base text-[#143329]">Ready for your first session?</h3>
              <p className="text-xs text-[#68857B] max-w-xs mx-auto leading-relaxed">
                Complete your first 20-minute bodyweight routine to log your initial session and start your consistency streak.
              </p>
            </div>

            <button
              onClick={() => navigate('/workout')}
              className="w-full py-3.5 px-6 rounded-full bg-[#27B68C] hover:bg-[#20A07A] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_10px_24px_rgba(39,182,140,0.3)] flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start First Workout</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#143329]">
                Session Logs ({history.length})
              </span>
              <span className="text-[11px] font-bold text-[#68857B]">
                Sorted by newest
              </span>
            </div>

            <motion.div
              className="space-y-2.5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {history.map((log) => {
                const diffConfig = {
                  easy: { label: 'Easy Pace', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  good: { label: 'Solid Effort', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
                  hard: { label: 'Challenging', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
                }[log.difficulty] || { label: log.difficulty, bg: 'bg-gray-50 text-gray-700 border-gray-200' }

                return (
                  <motion.div
                    key={log.id}
                    variants={itemVariants}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-white/80 shadow-[0_6px_20px_rgba(20,55,42,0.03)] hover:border-[#D5ECE1] transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#EBF7F2] border border-[#D5EFE3] flex items-center justify-center text-[#27B68C] shrink-0 shadow-2xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-[#143329]">20-Min Full Body</div>
                        <div className="text-xs text-[#68857B] font-medium">
                          {formatDate(log.date)} • 4 Rounds Complete
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${diffConfig.bg}`}>
                        {diffConfig.label}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
