import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { SettingsProvider } from '@/hooks/useSettings'
import Home from '@/pages/Home'
import Workout from '@/pages/Workout'
import History from '@/pages/History'
import Settings from '@/pages/Settings'
import Navigation from '@/components/Navigation'

function AppContent() {
  const location = useLocation()
  const isWorkout = location.pathname === '/workout'

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/workout" 
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Workout />
                </motion.div>
              } 
            />
            <Route 
              path="/history" 
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <History />
                </motion.div>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
