import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Flame, Trophy, ArrowRight } from "lucide-react";
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0E1F19] text-white selection:bg-[#27B68C]">
      <AnimatePresence mode="wait">
        {!isLogged ? (
          <motion.div
            key="phase-1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex w-full max-w-md flex-col items-center gap-6"
          >
            <div className="text-center space-y-1">
              <span className="text-xs font-black tracking-widest uppercase text-[#27B68C] bg-[#27B68C]/15 px-3.5 py-1 rounded-full border border-[#27B68C]/30">
                Workout Complete
              </span>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mt-3">DONE.</h1>
              <p className="text-sm text-[#8BAAA0] font-medium">20 Minutes of Full Body Strength</p>
            </div>

            {/* Session Stats Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 w-full rounded-2xl bg-[#162D24] p-4 text-center border border-white/10 shadow-lg">
              <div className="p-2">
                <p className="text-lg font-black text-white">4 / 4</p>
                <p className="text-[10px] font-bold text-[#8BAAA0] uppercase tracking-wider">ROUNDS</p>
              </div>
              <div className="p-2 border-x border-white/10">
                <p className="text-lg font-black text-white">5 / 5</p>
                <p className="text-[10px] font-bold text-[#8BAAA0] uppercase tracking-wider">EXERCISES</p>
              </div>
              <div className="p-2">
                <p className="text-lg font-black text-[#27B68C]">20:00</p>
                <p className="text-[10px] font-bold text-[#8BAAA0] uppercase tracking-wider">MINUTES</p>
              </div>
            </div>

            {/* Difficulty Question */}
            <div className="flex w-full flex-col gap-3">
              <p className="text-center text-xs font-black uppercase tracking-widest text-[#8BAAA0]">
                How did today's session feel?
              </p>
              <div className="flex gap-2">
                {(["easy", "good", "hard"] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={cn(
                      "flex-1 rounded-2xl border-2 py-3.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                      selectedDifficulty === diff
                        ? diff === "easy"
                          ? "border-[#27B68C] bg-[#27B68C]/20 text-[#27B68C] shadow-[0_4px_16px_rgba(39,182,140,0.3)]"
                          : diff === "good"
                          ? "border-teal-400 bg-teal-500/20 text-teal-300 shadow-[0_4px_16px_rgba(45,212,191,0.3)]"
                          : "border-[#FF7754] bg-[#FF7754]/20 text-[#FF7754] shadow-[0_4px_16px_rgba(255,119,84,0.3)]"
                        : "border-[#1D3A30] bg-[#162D24] text-[#8BAAA0] hover:border-[#27B68C]/40"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {selectedDifficulty && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleLog}
                className="w-full rounded-full bg-[#27B68C] hover:bg-[#22A57E] py-4 font-black text-white text-base shadow-[0_10px_28px_rgba(39,182,140,0.4)] transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>LOG WORKOUT</span>
                <Check className="w-5 h-5 stroke-[3]" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="phase-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex w-full max-w-md flex-col items-center gap-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#27B68C] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(39,182,140,0.4)]">
              <Check size={44} strokeWidth={3.5} />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white">WORKOUT LOGGED</h1>
              <p className="text-xs font-semibold text-[#8BAAA0]">{todayStr} • 20 MINUTES COMPLETED</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full rounded-2xl bg-[#162D24] p-5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF0E8] text-[#FF7754] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BAAA0] block">Streak</span>
                  <span className="text-base font-black text-white">{streak} DAYS</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF7F2] text-[#27B68C] flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BAAA0] block">Total</span>
                  <span className="text-base font-black text-white">{totalWorkouts} LOGS</span>
                </div>
              </div>
            </div>

            <button
              onClick={onDone}
              className="mt-2 w-full rounded-full bg-white hover:bg-neutral-100 py-4 font-black text-[#143329] text-base shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>RETURN HOME</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
