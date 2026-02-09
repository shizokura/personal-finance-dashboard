import type { Transaction, DateRange, DateFilter } from '@/lib/types'

export function getMonthDateRange(month: number, year: number): DateRange {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59, 999)
  return { start: startDate, end: endDate }
}

export function getPresetDateRange(filter: DateFilter): DateRange | undefined {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const startOfDay = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const endOfDay = (date: Date) => {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
  }

  switch (filter) {
    case 'today':
      return { start: startOfDay(today), end: endOfDay(today) }

    case 'thisWeek': {
      const dayOfWeek = today.getDay()
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const monday = new Date(today)
      monday.setDate(today.getDate() - diff)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      return { start: startOfDay(monday), end: endOfDay(sunday) }
    }

    case 'thisMonth': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start: startOfDay(firstDay), end: endOfDay(lastDay) }
    }

    case 'thisYear': {
      const firstDay = new Date(now.getFullYear(), 0, 1)
      const lastDay = new Date(now.getFullYear(), 11, 31)
      return { start: startOfDay(firstDay), end: endOfDay(lastDay) }
    }

    case 'allTime':
    case 'custom':
      return undefined
  }
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  range: DateRange
): Transaction[] {
  return transactions.filter((t) => {
    return t.date >= range.start && t.date <= range.end
  })
}
