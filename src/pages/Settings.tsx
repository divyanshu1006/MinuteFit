import { useState } from 'react'
import { motion } from 'motion/react'
import { useSettings } from '@/hooks/useSettings'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { Volume2, Music, SunMoon, RotateCcw, ShieldAlert } from 'lucide-react'
import Logo from '@/components/Logo'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer p-0.5 ${
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
  const [resetState, setResetState] = useState<'idle' | 'confirm'>('idle')
  
  const handleResetClick = () => {
    if (resetState === 'idle') {
      setResetState('confirm')
      setTimeout(() => setResetState('idle'), 3000)
    } else {
      clearHistory()
      setResetState('idle')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] text-[#143329] px-5 pt-8 pb-28">
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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EBF7F2] flex items-center justify-center text-[#27B68C]">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#143329]">Voice Guidance</div>
                <div className="text-xs text-[#68857B]">Spoken cues and countdowns</div>
              </div>
            </div>
            <Toggle checked={settings.voiceEnabled} onChange={toggleVoice} />
          </div>
          
          <div className="h-px bg-[#EEF5F1]" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFF0E8] flex items-center justify-center text-[#FF7754]">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#143329]">Sound Effects</div>
                <div className="text-xs text-[#68857B]">Audio beeps & chimes</div>
              </div>
            </div>
            <Toggle checked={settings.soundEnabled} onChange={toggleSound} />
          </div>
        </div>

        {/* Appearance Card */}
        <div className="rounded-[28px] bg-white p-5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <SunMoon className="w-4 h-4 text-[#27B68C]" />
            <span className="font-extrabold text-sm text-[#143329]">Theme Mode</span>
          </div>

          <div className="flex p-1 bg-[#F1F7F4] rounded-2xl border border-[#E3EEE9]">
            {(['light', 'dark', 'system'] as const).map(t => (
              <button
                key={t}
                onClick={() => updateSettings({ theme: t })}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl capitalize transition-all cursor-pointer ${
                  settings.theme === t 
                    ? 'bg-[#27B68C] text-white shadow-sm' 
                    : 'text-[#68857B] hover:text-[#143329]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-[28px] bg-white p-5 border border-white/80 shadow-[0_10px_30px_rgba(20,55,42,0.04)] space-y-3">
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-extrabold text-sm text-[#143329]">Data Management</span>
          </div>
          
          <button
            onClick={handleResetClick}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
              resetState === 'confirm' 
                ? 'bg-rose-500 text-white shadow-[0_8px_20px_rgba(244,63,94,0.3)] animate-pulse' 
                : 'bg-[#FFF1F0] text-rose-600 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {resetState === 'confirm' ? 'Tap again to confirm reset' : 'Reset Workout History'}
          </button>
        </div>
      </div>
    </div>
  )
}
