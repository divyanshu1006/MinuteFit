import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSettings } from '@/hooks/useSettings'
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory'
import { useSpeech } from '@/hooks/useSpeech'
import { useSound } from '@/hooks/useSound'
import { exportBackupFile, restoreBackupData } from '@/utils/backup'
import { 
  Volume2, 
  Music, 
  Sun, 
  Moon, 
  Monitor, 
  RotateCcw, 
  Play, 
  Check, 
  AlertTriangle,
  Lock,
  Download,
  Upload,
  Database,
  Cloud,
  FileCheck
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
        checked ? 'bg-[#27B68C]' : 'bg-[#D1E0D9] dark:bg-[#233F36]'
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
  const { clearHistory, getHistory } = useWorkoutHistory()
  const { speak } = useSpeech(settings.voiceEnabled)
  const { playComplete } = useSound(settings.soundEnabled)
  
  const [resetState, setResetState] = useState<'idle' | 'confirm' | 'success'>('idle')
  const [testVoiceActive, setTestVoiceActive] = useState(false)
  const [testSoundActive, setTestSoundActive] = useState(false)
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleExportBackup = () => {
    try {
      exportBackupFile()
      setBackupMessage({ type: 'success', text: 'Backup downloaded! You can keep it on your device or save to Google Drive.' })
      setTimeout(() => setBackupMessage(null), 5000)
    } catch (e) {
      setBackupMessage({ type: 'error', text: 'Failed to create backup file.' })
      setTimeout(() => setBackupMessage(null), 5000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (!content) return

      const result = restoreBackupData(content)
      if (result.success) {
        setBackupMessage({ type: 'success', text: result.message })
        // Trigger a reload or state refresh after short delay
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      } else {
        setBackupMessage({ type: 'error', text: result.message })
        setTimeout(() => setBackupMessage(null), 5000)
      }
    }
    reader.readAsText(file)
    // Clear input so same file can be re-uploaded if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
    <div className="min-h-screen bg-gradient-to-b from-[#EBF7F2] via-[#F5FAF7] to-[#FFF6F0] dark:from-[#0B1A15] dark:via-[#0F221B] dark:to-[#122A21] text-[#143329] dark:text-[#E8F4F0] px-5 pt-8 pb-32 transition-colors duration-200">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#68857B] dark:text-[#8EA89E]">Preferences</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#143329] dark:text-white tracking-tight">Settings</h1>
          </div>
          <Logo size="sm" showText={false} />
        </div>

        {/* Audio Preferences Card */}
        <div className="rounded-[28px] bg-white dark:bg-[#142A21] p-5 border border-white/80 dark:border-[#234537] shadow-[0_10px_30px_rgba(20,55,42,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#143329] dark:text-white">
              Audio & Coaching
            </span>
            <span className="text-[11px] font-bold text-[#68857B] dark:text-[#8EA89E]">
              Hands-free guidance
            </span>
          </div>

          {/* Voice Guidance Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EBF7F2] dark:bg-[#1C382D] flex items-center justify-center text-[#27B68C]">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#143329] dark:text-white">Spoken Voice Coach</div>
                  <div className="text-xs text-[#68857B] dark:text-[#8EA89E]">Announces exercises, rounds & cues</div>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F8F4] dark:bg-[#1C382D] hover:bg-[#E3F4EC] dark:hover:bg-[#234537] text-[#27B68C] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{testVoiceActive ? 'Playing sample...' : 'Test voice cue'}</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="h-px bg-[#EEF5F1] dark:bg-[#234537]" />

          {/* Sound Effects Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E8] dark:bg-[#38231C] flex items-center justify-center text-[#FF7754]">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#143329] dark:text-white">Sound Effects</div>
                  <div className="text-xs text-[#68857B] dark:text-[#8EA89E]">Interval countdown beeps & bells</div>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF4EE] dark:bg-[#38231C] hover:bg-[#FFEADF] dark:hover:bg-[#4A2D23] text-[#FF7754] text-xs font-bold transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{testSoundActive ? 'Playing chime...' : 'Test chime'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Appearance Card */}
        <div className="rounded-[28px] bg-white dark:bg-[#142A21] p-5 border border-white/80 dark:border-[#234537] shadow-[0_10px_30px_rgba(20,55,42,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#143329] dark:text-white">
              Appearance
            </span>
            <span className="text-[11px] font-bold text-[#68857B] dark:text-[#8EA89E] capitalize">
              {settings.theme} Mode
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F1F7F4] dark:bg-[#10221B] rounded-2xl border border-[#E3EEE9] dark:border-[#234537]">
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
                    : 'text-[#68857B] dark:text-[#8EA89E] hover:text-[#143329] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Backup & Restore Card (No Sign-In Required) */}
        <div className="rounded-[28px] bg-white dark:bg-[#142A21] p-5 border border-white/80 dark:border-[#234537] shadow-[0_10px_30px_rgba(20,55,42,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#27B68C]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#143329] dark:text-white">
                Data Backup & Restore
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#27B68C] bg-[#EBF7F2] dark:bg-[#1C382D] px-2 py-0.5 rounded-full border border-[#D5EFE3] dark:border-[#2B5443]">
              No Login Needed
            </span>
          </div>

          <p className="text-xs text-[#597B6F] dark:text-[#8EA89E] leading-relaxed">
            Download your workout logs and streaks as a JSON file. Store it locally on your phone/PC or upload it to Google Drive/iCloud for safe keeping.
          </p>

          {/* Action Buttons: Export & Import */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleExportBackup}
              className="py-3 px-3.5 rounded-2xl bg-[#EBF7F2] dark:bg-[#1C382D] hover:bg-[#DDF2E8] dark:hover:bg-[#234537] text-[#1E6852] dark:text-[#32D2A2] font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-[#CDEEE0] dark:border-[#2B5443] cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-3.5 rounded-2xl bg-[#F6FAF8] dark:bg-[#10221B] hover:bg-[#EEF6F2] dark:hover:bg-[#183127] text-[#344E44] dark:text-[#C6E2D8] font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-[#E5EFEA] dark:border-[#234537] cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4 text-[#27B68C]" />
              <span>Import / Restore</span>
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {backupMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  backupMessage.type === 'success'
                    ? 'bg-[#EBF7F2] dark:bg-[#1C382D] text-[#1E6852] dark:text-[#32D2A2] border border-[#27B68C]/40'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {backupMessage.type === 'success' ? <FileCheck className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{backupMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy & Storage Guarantee Card */}
        <div className="rounded-[24px] bg-[#EAF5F0] dark:bg-[#10241C] p-4.5 border border-[#D5ECE1] dark:border-[#234537] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1C382D] flex items-center justify-center text-[#27B68C] shrink-0 shadow-2xs">
            <Lock className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-extrabold text-[#143329] dark:text-white">100% Private & Local</div>
            <p className="text-[#597B6F] dark:text-[#8EA89E] leading-relaxed">
              Your workout logs, streaks, and preferences never leave this browser. No external tracking or account required.
            </p>
          </div>
        </div>

        {/* Data Management & History Reset */}
        <div className="rounded-[28px] bg-white dark:bg-[#142A21] p-5 border border-white/80 dark:border-[#234537] shadow-[0_10px_30px_rgba(20,55,42,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] space-y-3">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-[#143329] dark:text-white">Data Management</span>
          </div>

          <AnimatePresence mode="wait">
            {resetState === 'idle' && (
              <motion.button
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleResetClick}
                className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs tracking-wider uppercase bg-[#FFF1F0] dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3"
              >
                <div className="text-xs text-rose-800 dark:text-rose-300 font-semibold leading-relaxed">
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
                    className="py-2.5 px-4 rounded-xl bg-white dark:bg-[#183127] hover:bg-rose-100 dark:hover:bg-[#234537] text-[#556961] dark:text-[#8EA89E] font-bold text-xs border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
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
                className="p-3.5 rounded-2xl bg-[#EBF7F2] dark:bg-[#1C382D] border border-[#27B68C] text-[#1E6852] dark:text-[#2DD4A3] flex items-center justify-center gap-2 text-xs font-extrabold"
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
