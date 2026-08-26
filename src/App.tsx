import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { SettingsProvider } from '@/hooks/useSettings'
import { initGA, trackPageView } from '@/utils/analytics'
import Home from '@/pages/Home'
import Workout from '@/pages/Workout'
import History from '@/pages/History'
import Settings from '@/pages/Settings'
import Navigation from '@/components/Navigation'

function AppContent() {
  const location = useLocation()
  const isWorkout = location.pathname === '/workout'

  // Initialize GA once on load
  useEffect(() => {
    initGA()
  }, [])

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  const pageTransition = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.22, ease: "easeOut" as const }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F8F5] dark:bg-[#0B1A15] transition-colors duration-200">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <motion.div {...pageTransition}>
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/workout" 
              element={
                <motion.div {...pageTransition}>
                  <Workout />
                </motion.div>
              } 
            />
            <Route 
              path="/history" 
              element={
                <motion.div {...pageTransition}>
                  <History />
                </motion.div>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <motion.div {...pageTransition}>
                  <Settings />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
      {!isWorkout && <Navigation />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </BrowserRouter>
  )
}
