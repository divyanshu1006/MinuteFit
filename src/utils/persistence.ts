const STORAGE_PREFIX = 'minutefit_'

/**
 * Safely read and parse JSON from localStorage.
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    return parsed as T
  } catch {
    // Corrupted data — return fallback without crashing
    console.warn(`[MinuteFit] Failed to parse stored data for "${key}", using fallback.`)
    return fallback
  }
}

/**
 * Safely write JSON to localStorage.
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    console.warn(`[MinuteFit] Failed to save data for "${key}".`)
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // Ignore
  }
}

/**
 * Check if localStorage is available.
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__minutefit_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
