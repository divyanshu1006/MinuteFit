import { motion } from 'motion/react'
import { Check, Calendar, Clock, Trophy } from 'lucide-react'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { formatDate } from '@/utils/dates'

export default function History() {
  const { getHistory, getTotalWorkouts, getTotalMinutes } = useWorkoutHistory()
  const history = getHistory()
  const totalWorkouts = getTotalWorkouts()
  const totalMinutes = getTotalMinutes()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] text-[#143329] px-5 pt-8 pb-28">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#68857B]">Activity Log</p>
          <h1 className="text-2xl sm:text-3xl font-black text-[#143329] tracking-tight">Workout History</h1>
        </div>

        {/* Aggregate Stats Pill Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 border border-white/80 shadow-[0_8px_20px_rgba(20,55,42,0.04)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990] block">Completed</span>
              <span className="text-lg font-black text-[#143329]">{totalWorkouts} sessions</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-white/80 shadow-[0_8px_20px_rgba(20,55,42,0.04)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center text-[#FF7754] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9990] block">Total Time</span>
              <span className="text-lg font-black text-[#143329]">{totalMinutes} mins</span>
            </div>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white/70 border border-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EBF7F2] flex items-center justify-center text-[#27B68C] mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#143329]">No workouts logged yet</h3>
            <p className="text-xs text-[#68857B] mt-1">Complete your first 20-minute session to start your streak!</p>
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {history.map((log) => (
              <motion.div
                key={log.id}
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-white/80 shadow-[0_6px_20px_rgba(20,55,42,0.03)]"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#EBF7F2] border border-[#D5EFE3] flex items-center justify-center text-[#27B68C] shrink-0 shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#143329]">Full Body Workout</div>
                    <div className="text-xs text-[#68857B] font-medium">
                      {formatDate(log.date)} • 20 min
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                      log.difficulty === 'easy'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : log.difficulty === 'good'
                        ? 'bg-teal-50 text-teal-600 border-teal-200'
                        : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}
                  >
                    {log.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
