import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { WorkoutPhase } from "@/types/workout";

interface ProgressBarProps {
  progress: number;
  phase: WorkoutPhase;
}

export default function ProgressBar({ progress, phase }: ProgressBarProps) {
  const isRest = phase === "REST";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#172D25] border border-white/10 shadow-inner">
      <motion.div
        className={cn(
          "h-full rounded-full transition-colors duration-300 shadow-sm",
          isRest ? "bg-[#FF7754]" : "bg-[#27B68C]"
        )}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
        transition={{ duration: 0.4, ease: "linear" }}
      />
    </div>
  );
}
