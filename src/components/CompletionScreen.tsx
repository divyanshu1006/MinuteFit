import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Flame, Trophy, ArrowRight, Sparkles, Clock, Dumbbell } from "lucide-react";
import { Difficulty } from "@/types/workout";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dates";

interface CompletionScreenProps {
  onLog: (difficulty: Difficulty) => void;
  onDone: () => void;
  streak: number;
  totalWorkouts: number;
}

export default function CompletionScreen({
  onLog,
  onDone,
  streak,
  totalWorkouts,
}: CompletionScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  const handleLog = () => {
    if (selectedDifficulty) {
      onLog(selectedDifficulty);
      setIsLogged(true);
    }
  };

  const todayStr = formatDate(new Date().toISOString());

  const difficulties: { id: Difficulty; label: string; desc: string; color: string }[] = [
    { id: "easy", label: "Easy Pace", desc: "Light effort", color: "border-emerald-400 bg-emerald-500/20 text-emerald-300" },
    { id: "good", label: "Solid Workout", desc: "Great burn", color: "border-[#27B68C] bg-[#27B68C]/20 text-[#27B68C]" },
    { id: "hard", label: "Challenging", desc: "Pushed limits", color: "border-[#FF7A59] bg-[#FF7A59]/20 text-[#FF7A59]" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0E1F19] text-white selection:bg-[#27B68C] select-none">
      <AnimatePresence mode="wait">
        {!isLogged ? (
          <motion.div
            key="phase-1"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-md flex-col items-center gap-5"
          >
            {/* Header Badge */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#27B68C]/15 border border-[#27B68C]/30 text-xs font-black uppercase tracking-widest text-[#27B68C]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Session Complete</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2">
                20 MINUTES DONE.
              </h1>
              <p className="text-xs sm:text-sm text-[#8FA89E] font-medium">
                You showed up, pushed through 4 rounds, and finished strong.
              </p>
            </div>

            {/* Session Snapshot Card */}
            <div className="grid grid-cols-3 gap-2 w-full rounded-2xl bg-[#142A21] p-4 text-center border border-white/10 shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-white">4 / 4</span>
                <span className="text-[9px] font-bold text-[#8FA89E] uppercase tracking-wider">ROUNDS</span>
              </div>
              <div className="flex flex-col items-center border-x border-white/10">
                <span className="text-base font-black text-white">5 / 5</span>
                <span className="text-[9px] font-bold text-[#8FA89E] uppercase tracking-wider">EXERCISES</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-[#27B68C]">20:00</span>
                <span className="text-[9px] font-bold text-[#8FA89E] uppercase tracking-wider">MINUTES</span>
              </div>
            </div>

            {/* Difficulty Feedback Prompt */}
            <div className="flex w-full flex-col gap-2.5 pt-1">
              <span className="text-center text-xs font-black uppercase tracking-widest text-[#8FA89E]">
                How did today's session feel?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={cn(
                        "rounded-2xl border-2 py-3 px-2 flex flex-col items-center justify-center transition-all cursor-pointer",
                        isSelected
                          ? cn(diff.color, "shadow-md scale-102")
                          : "border-white/10 bg-[#142A21] text-[#8FA89E] hover:border-white/20"
                      )}
                    >
                      <span className="text-xs font-black uppercase tracking-wider">{diff.label}</span>
                      <span className="text-[10px] font-medium opacity-80 mt-0.5">{diff.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Log Action Button */}
            {selectedDifficulty ? (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleLog}
                className="w-full rounded-full bg-[#27B68C] hover:bg-[#20A07A] py-4 font-black text-white text-base shadow-[0_12px_28px_rgba(39,182,140,0.4)] transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                <span>LOG & SAVE WORKOUT</span>
                <Check className="w-5 h-5 stroke-[3]" />
              </motion.button>
            ) : (
              <p className="text-[11px] text-[#69887C] font-medium text-center">
                Select a pace rating above to log your workout
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="phase-2"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex w-full max-w-md flex-col items-center gap-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#27B68C] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(39,182,140,0.45)]">
              <Check size={44} strokeWidth={3.5} />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white">WORKOUT LOGGED</h1>
              <p className="text-xs font-semibold text-[#8FA89E] uppercase tracking-wider">{todayStr} • 20 MINUTES COMPLETED</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full rounded-2xl bg-[#142A21] p-5 border border-white/10 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E8] text-[#FF7754] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8FA89E] block">Active Streak</span>
                  <span className="text-base font-black text-white">{streak} {streak === 1 ? 'DAY' : 'DAYS'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EBF7F2] text-[#27B68C] flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8FA89E] block">Total Sessions</span>
                  <span className="text-base font-black text-white">{totalWorkouts} LOGS</span>
                </div>
              </div>
            </div>

            <button
              onClick={onDone}
              className="mt-2 w-full rounded-full bg-white hover:bg-neutral-100 py-4 font-black text-[#143329] text-base shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>RETURN TO HOME</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
