import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-sm rounded-2xl bg-neutral-900 p-6 text-white shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="mb-2 text-xl font-bold">Quit Workout?</h2>
            <p className="mb-6 text-sm text-neutral-400">
              Your current workout will not be logged. Are you sure you want to quit?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-lg border border-neutral-700 bg-transparent py-2.5 text-sm font-medium hover:bg-neutral-800"
              >
                CANCEL
              </button>
              <button
                onClick={onQuit}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600"
              >
                QUIT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
