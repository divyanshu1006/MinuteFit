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
    <div className="flex flex-col items-center justify-center select-none py-1 w-full text-center">
      <div
        aria-live="off"
        className={cn(
          "timer-display font-mono font-black tracking-tighter leading-none transition-colors duration-300",
          "text-[4.75rem] xs:text-7xl sm:text-8xl md:text-9xl",
          isWork ? "text-white drop-shadow-[0_0_24px_rgba(39,182,140,0.3)]" : "",
          isRest ? "text-[#FF7754] drop-shadow-[0_0_24px_rgba(255,119,84,0.3)]" : "text-white"
        )}
      >
        {formatTime(displaySeconds)}
      </div>

      {/* Sub-label under timer */}
      <div
        className={cn(
          "text-[10px] sm:text-xs font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full border transition-colors duration-300",
          isWork ? "bg-[#27B68C]/15 text-[#27B68C] border-[#27B68C]/30" : isRest ? "bg-[#FF7754]/15 text-[#FF7754] border-[#FF7754]/30" : "text-neutral-400 border-neutral-800"
        )}
      >
        {isWork ? "WORK TIME REMAINING" : isRest ? "REST & PREPARE" : ""}
      </div>
    </div>
  );
}
