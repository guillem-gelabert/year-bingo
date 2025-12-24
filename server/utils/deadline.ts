/**
 * Get the deadline for the current year (December 31, 23:59:59)
 */
export function getCurrentYearDeadline(): Date {
  const now = new Date()
  const year = now.getFullYear()
  // December 31, 23:59:59 in the configured timezone
  return new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))
}

/**
 * Check if the current time is before the deadline
 */
export function isBeforeDeadline(): boolean {
  return new Date() < getCurrentYearDeadline()
}

/**
 * Check if editing is allowed (before deadline)
 */
export function canEdit(): boolean {
  return isBeforeDeadline()
}

/**
 * Check if bingo cards should be publicly visible (after deadline)
 */
export function isPublicViewEnabled(): boolean {
  return !isBeforeDeadline()
}
