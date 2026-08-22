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
    <div className="flex flex-col items-center gap-3 text-xs uppercase tracking-widest text-neutral-400 select-none">
      {/* Round and Exercise Counters */}
      <div className="flex items-center gap-3 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-800 font-bold">
        <span className="text-white">
          ROUND {currentRound} <span className="text-neutral-500 font-normal">/ {totalRounds}</span>
        </span>
        <span className="text-neutral-700">•</span>
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
              "px-3 py-1 rounded-full font-bold transition-colors duration-300",
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
