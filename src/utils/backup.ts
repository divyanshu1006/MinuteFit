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
 * Export all MinuteFit data as a downloadable JSON file.
 */
export function exportBackupFile(): void {
  const history = loadFromStorage<WorkoutLog[]>('history', [])
  const settings = loadFromStorage<AppSettings>('settings', {
    voiceEnabled: true,
    soundEnabled: true,
    theme: 'system'
  })

  const backup: BackupData = {
    app: 'MinuteFit',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      history,
      settings
    }
  }

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
