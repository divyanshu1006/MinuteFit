import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CountdownProps {
  exerciseName?: string;
  onComplete: () => void;
  onBeep?: () => void;
  speak?: (text: string) => void;
}

export default function Countdown({
  exerciseName = "Push-ups",
  onComplete,
  onBeep,
  speak,
}: CountdownProps) {
  const [count, setCount] = useState(3);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      speak?.("Get ready.");
      setTimeout(() => {
        speak?.(exerciseName);
      }, 700);
    }
  }, [exerciseName, speak]);

  useEffect(() => {
    if (count > 0) {
      onBeep?.();
      speak?.(count.toString());
    } else if (count === 0) {
      speak?.("Start");
    }

    const timer = setTimeout(() => {
      if (count === 0) {
        onComplete();
      } else {
        setCount((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete, onBeep, speak]);

  const display = count > 0 ? count.toString() : "GO";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E1F19] px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#183127] border border-[#27B68C]/30 text-xs font-black tracking-widest uppercase text-[#27B68C]"
      >
        <span>First up: {exerciseName}</span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-8xl md:text-9xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_40px_rgba(39,182,140,0.35)]"
        >
          {display}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
