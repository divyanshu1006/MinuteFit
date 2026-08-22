import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/dates";
import { WorkoutPhase } from "@/types/workout";

interface TimerProps {
  seconds: number;
  phase: WorkoutPhase;
}

export default function Timer({ seconds, phase }: TimerProps) {
  const isWork = phase === "WORK";
  const isRest = phase === "REST";
  const displaySeconds = Math.max(0, Math.ceil(seconds));

  return (
    <div className="flex flex-col items-center justify-center select-none py-2">
      <div
        aria-live="off"
        className={cn(
          "timer-display font-mono font-black tracking-tighter text-7xl sm:text-8xl md:text-9xl transition-colors duration-300",
          isWork ? "text-white" : "",
          isRest ? "text-cyan-400" : "text-neutral-200"
        )}
      >
        {formatTime(displaySeconds)}
      </div>

      {/* Sub-label under timer */}
      <div
        className={cn(
          "text-xs font-bold uppercase tracking-widest mt-1 transition-colors duration-300",
          isWork ? "text-orange-400" : isRest ? "text-cyan-400" : "text-neutral-400"
        )}
      >
        {isWork ? "WORK TIME REMAINING" : isRest ? "REST & PREPARE" : ""}
      </div>
    </div>
  );
}
