import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSettings } from '@/hooks/useSettings'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useSpeech } from '@/hooks/useSpeech'
import { useSound } from '@/hooks/useSound'
import { 
  Volume2, 
  Music, 
  Sun, 
  Moon, 
  Monitor, 
  RotateCcw, 
  ShieldCheck, 
  Play, 
  Check, 
  AlertTriangle,
  Lock
} from 'lucide-react'
import Logo from '@/components/Logo'

function Toggle({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean; 
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27B68C] focus:ring-offset-2 cursor-pointer p-0.5 ${
        checked ? 'bg-[#27B68C]' : 'bg-[#D1E0D9]'
      }`}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-sm"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export default function Settings() {
  const { settings, toggleVoice, toggleSound, updateSettings } = useSettings()
  const { clearHistory } = useWorkoutHistory()
  const { speak } = useSpeech(settings.voiceEnabled)
  const { playComplete } = useSound(settings.soundEnabled)
  
  const [resetState, setResetState] = useState<'idle' | 'confirm' | 'success'>('idle')
  const [testVoiceActive, setTestVoiceActive] = useState(false)
  const [testSoundActive, setTestSoundActive] = useState(false)

  const handleTestVoice = () => {
    if (!settings.voiceEnabled) return
    setTestVoiceActive(true)
    speak('Ready. 3, 2, 1. Push-ups!')
    setTimeout(() => setTestVoiceActive(false), 2500)
  }

  const handleTestSound = () => {
    if (!settings.soundEnabled) return
    setTestSoundActive(true)
    playComplete()
    setTimeout(() => setTestSoundActive(false), 1200)
  }

  const handleResetClick = () => {
    if (resetState === 'idle') {
      setResetState('confirm')
    } else if (resetState === 'confirm') {
      clearHistory()
      setResetState('success')
      setTimeout(() => setResetState('idle'), 3000)
    }
  }

  const cancelReset = () => {
    setResetState('idle')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] text-[#143329] px-5 pt-8 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#68857B]">Preferences</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#143329] tracking-tight">Settings</h1>
          </div>
          <Logo size="sm" showText={false} />
        </div>

        {/* Audio Preferences Card */}
        <div className="rounded-[28px] bg-white p-5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#143329]">
              Audio & Coaching
            </span>
            <span className="text-[11px] font-bold text-[#68857B]">
              Hands-free guidance
            </span>
          </div>

          {/* Voice Guidance Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EBF7F2] flex items-center justify-center text-[#27B68C]">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#143329]">Spoken Voice Coach</div>
                  <div className="text-xs text-[#68857B]">Announces exercises, rounds & cues</div>
                </div>
              </div>
              <Toggle 
                checked={settings.voiceEnabled} 
                onChange={toggleVoice} 
                label="Toggle spoken voice coach"
              />
            </div>

            {settings.voiceEnabled && (
              <div className="pl-13 pt-1">
                <button
                  onClick={handleTestVoice}
                  disabled={testVoiceActive}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F8F4] hover:bg-[#E3F4EC] text-[#27B68C] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{testVoiceActive ? 'Playing sample...' : 'Test voice cue'}</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="h-px bg-[#EEF5F1]" />

          {/* Sound Effects Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#FF7754]">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#143329]">Sound Effects</div>
                  <div className="text-xs text-[#68857B]">Interval countdown beeps & bells</div>
                </div>
              </div>
              <Toggle 
                checked={settings.soundEnabled} 
                onChange={toggleSound} 
                label="Toggle sound effects"
              />
            </div>

            {settings.soundEnabled && (
              <div className="pl-13 pt-1">
                <button
                  onClick={handleTestSound}
                  disabled={testSoundActive}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF4EE] hover:bg-[#FFEADF] text-[#FF7754] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{testSoundActive ? 'Playing chime...' : 'Test chime'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Appearance Card */}
        <div className="rounded-[28px] bg-white p-5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#143329]">
              Appearance
            </span>
            <span className="text-[11px] font-bold text-[#68857B] capitalize">
              {settings.theme} Mode
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F1F7F4] rounded-2xl border border-[#E3EEE9]">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => updateSettings({ theme: id as 'light' | 'dark' | 'system' })}
                className={`py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  settings.theme === id 
                    ? 'bg-[#27B68C] text-white shadow-sm' 
                    : 'text-[#68857B] hover:text-[#143329] hover:bg-white/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & Storage Guarantee Card */}
        <div className="rounded-[24px] bg-[#EAF5F0] p-4.5 border border-[#D5ECE1] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#27B68C] shrink-0 shadow-2xs">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-extrabold text-[#143329]">100% Private & Local</div>
            <p className="text-[#597B6F] leading-relaxed">
              Your workout logs, streaks, and preferences never leave this browser. No external tracking or account required.
            </p>
          </div>
        </div>

        {/* Data Management & History Reset */}
        <div className="rounded-[28px] bg-white p-5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-3">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-[#143329]">Data Management</span>
          </div>

          <AnimatePresence mode="wait">
            {resetState === 'idle' && (
              <motion.button
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleResetClick}
                className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase bg-[#FFF1F0] text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Workout History</span>
              </motion.button>
            )}

            {resetState === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3"
              >
                <div className="text-xs text-rose-800 font-semibold leading-relaxed">
                  Are you sure? This will permanently delete all completed workouts and reset your streak.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetClick}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
                  >
                    Yes, Delete History
                  </button>
                  <button
                    onClick={cancelReset}
                    className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-100 text-[#556961] font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {resetState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-2xl bg-[#EBF7F2] border border-[#27B68C] text-[#1E6852] flex items-center justify-center gap-2 text-xs font-extrabold"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>History cleared successfully</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
