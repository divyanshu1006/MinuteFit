import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { WorkoutPhase } from "@/types/workout";

interface WorkoutInfoProps {
  currentRound: number;
  totalRounds: number;
  currentExerciseIndex: number;
  totalExercises: number;
  nextExerciseName: string | null;
  phase: WorkoutPhase;
}

export default function WorkoutInfo({
  currentRound,
  totalRounds,
  currentExerciseIndex,
  totalExercises,
  nextExerciseName,
  phase,
}: WorkoutInfoProps) {
  const isRest = phase === "REST";

  return (
    <div className="flex flex-col items-center gap-3 text-xs uppercase tracking-widest text-neutral-400 select-none w-full max-w-sm mx-auto">
      {/* Round & Exercise Counters */}
      <div className="flex items-center justify-between w-full bg-neutral-900/80 px-4 py-2.5 rounded-2xl border border-neutral-800 font-bold">
        <span className="text-white">
          ROUND {currentRound} <span className="text-neutral-500 font-normal">/ {totalRounds}</span>
        </span>
        
        {/* Mini 5-dot exercise progress indicator */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalExercises }).map((_, idx) => {
            const isDone = idx < currentExerciseIndex;
            const isCurrent = idx === currentExerciseIndex;
            return (
              <div
                key={idx}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  isDone
                    ? "bg-[#27B68C]"
                    : isCurrent
                    ? isRest
                      ? "bg-cyan-400 scale-125 ring-2 ring-cyan-400/40"
                      : "bg-[#27B68C] scale-125 ring-2 ring-[#27B68C]/40"
                    : "bg-neutral-800"
                )}
              />
            );
          })}
        </div>

        <span className="text-white">
          EXERCISE {currentExerciseIndex + 1} <span className="text-neutral-500 font-normal">/ {totalExercises}</span>
        </span>
      </div>

      {/* Up Next Pill */}
      <AnimatePresence mode="wait">
        {nextExerciseName && (
          <motion.div
            key={nextExerciseName}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn(
              "px-3.5 py-1 rounded-full font-bold transition-colors duration-300",
              isRest
                ? "bg-cyan-950/70 border border-cyan-800/80 text-cyan-300"
                : "text-neutral-500"
            )}
          >
            {isRest ? `NEXT: ${nextExerciseName}` : `Upcoming: ${nextExerciseName}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
