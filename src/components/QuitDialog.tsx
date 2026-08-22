import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Play, X } from "lucide-react";

interface QuitDialogProps {
  open: boolean;
  onCancel: () => void;
  onQuit: () => void;
}

export default function QuitDialog({ open, onCancel, onQuit }: QuitDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-[#07130F]/85 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative z-10 w-full max-w-sm rounded-[28px] bg-[#142A21] p-6 text-white border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF1F0] text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Pause & Leave Workout?</h2>
                <span className="text-xs text-[#8FA89E]">Your session is currently paused</span>
              </div>
            </div>

            <p className="mb-6 text-xs text-[#A7C5BA] leading-relaxed">
              If you leave now, this 20-minute session will not be saved to your workout history or streak.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Primary Safe Action: Keep Going */}
              <button
                onClick={onCancel}
                className="w-full rounded-2xl bg-[#27B68C] hover:bg-[#20A07A] py-3.5 px-4 text-xs font-black tracking-wider uppercase text-white shadow-[0_8px_20px_rgba(39,182,140,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Keep Going (Resume)</span>
              </button>

              {/* Secondary Action: Quit */}
              <button
                onClick={onQuit}
                className="w-full rounded-2xl bg-transparent hover:bg-rose-500/10 py-3 px-4 text-xs font-bold tracking-wider uppercase text-rose-400 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Quit & Exit to Home</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
