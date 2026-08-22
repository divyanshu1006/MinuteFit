/**
 * Get a local date string in YYYY-MM-DD format (timezone-safe).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if a date string is today (local timezone).
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getLocalDateString()
}

/**
 * Check if a date string is yesterday (local timezone).
 */
export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateStr === getLocalDateString(yesterday)
}

/**
 * Format a date string for display.
 * Returns "Today", "Yesterday", or a formatted date.
 */
export function formatDate(dateStr: string): string {
  if (isToday(dateStr)) return 'Today'
  if (isYesterday(dateStr)) return 'Yesterday'

  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format seconds as MM:SS.
 */
export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(Math.max(0, totalSeconds) / 60)
  const secs = Math.floor(Math.max(0, totalSeconds) % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Generate a simple unique ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
