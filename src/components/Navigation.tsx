import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Home, History as HistoryIcon, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  hidden?: boolean;
}

export default function Navigation({ hidden = false }: NavigationProps) {
  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none"
        >
          <nav className="pointer-events-auto flex items-center justify-around gap-2 px-4 py-2 rounded-full bg-white/95 dark:bg-[#152721]/95 backdrop-blur-xl border border-white/80 dark:border-[#233e34] shadow-[0_16px_36px_rgba(20,55,42,0.12)] min-w-[280px] max-w-sm w-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-[#27B68C] text-white shadow-[0_4px_14px_rgba(39,182,140,0.35)]"
                    : "text-[#648278] hover:text-[#143329] dark:text-[#8ea89e] dark:hover:text-white"
                )
              }
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-[#27B68C] text-white shadow-[0_4px_14px_rgba(39,182,140,0.35)]"
                    : "text-[#648278] hover:text-[#143329] dark:text-[#8ea89e] dark:hover:text-white"
                )
              }
            >
              <HistoryIcon size={18} />
              <span>History</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-[#27B68C] text-white shadow-[0_4px_14px_rgba(39,182,140,0.35)]"
                    : "text-[#648278] hover:text-[#143329] dark:text-[#8ea89e] dark:hover:text-white"
                )
              }
            >
              <SettingsIcon size={18} />
              <span>Settings</span>
            </NavLink>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
