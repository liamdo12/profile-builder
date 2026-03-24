/**
 * Format ISO timestamp to EST (America/New_York) display.
 * Example: "Feb 28, 2026, 4:08 PM EST"
 */
export function formatEstTimestamp(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(isoString))
}
