export function goToPreviousMonth(
  currentMonth: number,
  currentYear: number
): { month: number; year: number } {
  if (currentMonth === 1) {
    return { month: 12, year: currentYear - 1 }
  }
  return { month: currentMonth - 1, year: currentYear }
}

export function goToNextMonth(
  currentMonth: number,
  currentYear: number,
  maxMonth?: number,
  maxYear?: number
): { month: number; year: number } | null {
  if (maxMonth !== undefined && maxYear !== undefined) {
    if (currentMonth === maxMonth && currentYear === maxYear) {
      return null
    }
  }

  if (currentMonth === 12) {
    return { month: 1, year: currentYear + 1 }
  }
  return { month: currentMonth + 1, year: currentYear }
}

export function goToCurrentMonth(): { month: number; year: number } {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function isCurrentMonth(month: number, year: number): boolean {
  const now = new Date()
  return month === now.getMonth() + 1 && year === now.getFullYear()
}
