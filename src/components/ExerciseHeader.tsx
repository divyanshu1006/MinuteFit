import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Exercise, WorkoutPhase } from "@/types/workout";

interface ExerciseHeaderProps {
  exercise: Exercise;
  nextExercise: Exercise | null;
  phase: WorkoutPhase;
}

export default function ExerciseHeader({ exercise, nextExercise, phase }: ExerciseHeaderProps) {
  const [showInstruction, setShowInstruction] = useState(false);
  const isRest = phase === "REST";
  const activeExerciseForInfo = isRest && nextExercise ? nextExercise : exercise;

  return (
    <div className="flex flex-col items-center text-center px-4 select-none">
      {/* Phase Badge */}
      <div
        className={cn(
          "mb-3 rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest transition-colors duration-300",
          isRest ? "bg-cyan-950 text-cyan-400 border border-cyan-800" : "bg-orange-950 text-orange-400 border border-orange-800"
        )}
      >
        {isRest ? "REST PHASE (20s)" : "WORK PHASE (40s)"}
      </div>

      {/* Main Exercise Title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isRest ? "rest-title" : exercise.name}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          {isRest ? (
            <>
              <div className="text-3xl sm:text-4xl font-black text-cyan-300 tracking-tight">
                REST
              </div>
              {nextExercise && (
                <div className="mt-1 text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                  <span className="text-neutral-400 font-normal">Next:</span>
                  <span className="text-orange-400 underline decoration-orange-500/50 underline-offset-4">{nextExercise.name}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {exercise.name}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Expandable Exercise Technique Tip */}
      <button
        onClick={() => setShowInstruction((prev) => !prev)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-white bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800"
      >
        <Info size={14} className="text-neutral-400" />
        <span>{showInstruction ? "Hide form tips" : `Form tips: ${activeExerciseForInfo.name}`}</span>
      </button>

      <AnimatePresence>
        {showInstruction && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 max-w-sm overflow-hidden text-xs text-neutral-300 bg-neutral-900/95 p-3 rounded-xl border border-neutral-800 leading-relaxed shadow-lg"
          >
            <p className="font-semibold text-neutral-200 mb-1">{activeExerciseForInfo.name} Form:</p>
            {activeExerciseForInfo.instruction}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
