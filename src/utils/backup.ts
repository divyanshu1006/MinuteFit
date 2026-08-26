import { loadFromStorage, saveToStorage } from '@/utils/persistence'
import { WorkoutLog, AppSettings } from '@/types/workout'
import { getLocalDateString } from '@/utils/dates'

export interface BackupData {
  app: string
  version: string
  exportedAt: string
  data: {
    history: WorkoutLog[]
    settings: AppSettings
  }
}

/**
 * Generate backup data object.
 */
export function generateBackupData(): BackupData {
  const history = loadFromStorage<WorkoutLog[]>('history', [])
  const settings = loadFromStorage<AppSettings>('settings', {
    voiceEnabled: true,
    soundEnabled: true,
    theme: 'system'
  })

  return {
    app: 'MinuteFit',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      history,
      settings
    }
  }
}

/**
 * Export all MinuteFit data as a downloadable JSON file.
 */
export function exportBackupFile(): void {
  const backup = generateBackupData()
  const jsonStr = JSON.stringify(backup, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `minutefit-backup-${getLocalDateString()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Share backup file directly to Google Drive, iCloud, or other cloud storage via Web Share API.
 * Gracefully falls back to download if Web Share is unavailable.
 */
export async function shareBackupToCloud(): Promise<{
  success: boolean
  method: 'share' | 'download'
  message: string
}> {
  const backup = generateBackupData()
  const jsonStr = JSON.stringify(backup, null, 2)
  const fileName = `minutefit-backup-${getLocalDateString()}.json`
  const file = new File([jsonStr], fileName, { type: 'application/json' })

  // Check if native Web Share with files is supported
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'MinuteFit Workout Backup',
        text: 'MinuteFit backup file containing workout logs and streaks.',
        files: [file]
      })
      return {
        success: true,
        method: 'share',
        message: 'Saved via share sheet (Google Drive / Cloud)!'
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          method: 'share',
          message: 'Share cancelled.'
        }
      }
      // Fallback to download on unexpected error
      exportBackupFile()
      return {
        success: true,
        method: 'download',
        message: 'Downloaded backup file to your device.'
      }
    }
  } else {
    // Fallback directly to file download
    exportBackupFile()
    return {
      success: true,
      method: 'download',
      message: 'Downloaded backup file. You can now upload it directly to Google Drive.'
    }
  }
}

/**
 * Parse and restore MinuteFit data from a JSON string.
 */
export function restoreBackupData(jsonString: string): { 
  success: boolean
  message: string
  historyCount?: number 
} {
  try {
    const parsed = JSON.parse(jsonString) as BackupData

    if (!parsed || !parsed.data || !Array.isArray(parsed.data.history)) {
      return { 
        success: false, 
        message: 'Invalid backup file format. Expected a MinuteFit JSON backup.' 
      }
    }

    // Save restored history
    saveToStorage('history', parsed.data.history)

    // Save restored settings if present
    if (parsed.data.settings) {
      saveToStorage('settings', parsed.data.settings)
    }

    return {
      success: true,
      message: `Successfully restored ${parsed.data.history.length} workout logs!`,
      historyCount: parsed.data.history.length
    }
  } catch (err) {
    return {
      success: false,
      message: 'Failed to read backup file. Please make sure it is a valid JSON file.'
    }
  }
}
