import type { Transaction, Category, DateRange } from '@/lib/types'
import type { MonthlyTrend, TrendComparison } from '@/lib/types'
import { calculateMonthlySummary } from './monthly-summary'
import {
  filterTransactionsByPeriod,
  filterTransactionsByStatus,
  filterTransactionsByTypes,
} from './filter-helpers'
import { sumByType } from './filter-helpers'

export function calculateMonthlyTrends(
  transactions: Transaction[],
  categories: Category[],
  months: number = 6
): MonthlyTrend[] {
  const currentDate = new Date()
  const trends: MonthlyTrend[] = []

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    )
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const summary = calculateMonthlySummary(
      month,
      year,
      transactions,
      categories
    )

    const periodLabel = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(summary.period.startDate)

    trends.push({
      month,
      year,
      periodLabel,
      income: summary.monthlyIncome,
      expenses: summary.monthlyExpenses,
      savings: summary.netSavings,
      savingsRate: summary.savingsRate,
    })
  }

  return trends
}

function safeCalculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) {
    return 0
  }
  const change = current - previous
  return (change / previous) * 100
}

export function calculateTrendComparison(
  currentMonth: MonthlyTrend,
  previousMonth?: MonthlyTrend
): TrendComparison {
  const income = previousMonth
    ? currentMonth.income - previousMonth.income
    : currentMonth.income
  const incomePercentage = previousMonth
    ? safeCalculatePercentageChange(currentMonth.income, previousMonth.income)
    : 0

  const expenses = previousMonth
    ? currentMonth.expenses - previousMonth.expenses
    : currentMonth.expenses
  const expensesPercentage = previousMonth
    ? safeCalculatePercentageChange(
        currentMonth.expenses,
        previousMonth.expenses
      )
    : 0

  const savings = previousMonth
    ? currentMonth.savings - previousMonth.savings
    : currentMonth.savings

  const savingsRate = previousMonth
    ? currentMonth.savingsRate - previousMonth.savingsRate
    : currentMonth.savingsRate

  return {
    current: currentMonth,
    previous: previousMonth,
    change: {
      income,
      incomePercentage,
      expenses,
      expensesPercentage,
      savings,
      savingsRate,
    },
  }
}

export interface PeriodTrend {
  label: string
  income: number
  expenses: number
  savings: number
}

export function calculatePeriodTrends(
  transactions: Transaction[],
  range: DateRange,
  granularity: 'day' | 'week' | 'month' = 'day'
): PeriodTrend[] {
  const filteredTransactions = filterTransactionsByPeriod(transactions, range)
  const completedTransactions = filterTransactionsByStatus(
    filteredTransactions,
    'completed'
  )
  const validTransactions = filterTransactionsByTypes(completedTransactions, [
    'income',
    'expense',
    'refund',
  ])
  const trends: PeriodTrend[] = []

  const startDate = new Date(range.start)
  const endDate = new Date(range.end)

  if (granularity === 'day') {
    const currentDate = new Date(startDate)
    currentDate.setHours(0, 0, 0, 0)
    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)

    while (currentDate <= endOfDay) {
      const dayStart = new Date(currentDate)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(23, 59, 59, 999)

      const dayTransactions = validTransactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= dayStart && tDate <= dayEnd
      })

      const income =
        sumByType(
          dayTransactions.filter((t) => t.type === 'income'),
          'income'
        ) +
        sumByType(
          dayTransactions.filter((t) => t.type === 'refund'),
          'refund'
        )
      const expenses = sumByType(
        dayTransactions.filter((t) => t.type === 'expense'),
        'expense'
      )
      const savings = income - expenses

      const label = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(currentDate)
      trends.push({ label, income, expenses, savings })

      currentDate.setDate(currentDate.getDate() + 1)
    }
  } else if (granularity === 'week') {
    const weekStart = new Date(startDate)
    const dayOfWeek = weekStart.getDay()
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    weekStart.setDate(weekStart.getDate() - diff)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const currentWeekStart = new Date(weekStart)
    const maxDate = new Date(endDate)
    maxDate.setHours(23, 59, 59, 999)

    while (currentWeekStart <= maxDate) {
      const currentWeekEnd = new Date(currentWeekStart)
      currentWeekEnd.setDate(currentWeekEnd.getDate() + 6)
      currentWeekEnd.setHours(23, 59, 59, 999)

      const adjustedEnd = currentWeekEnd > maxDate ? maxDate : currentWeekEnd

      const weekTransactions = validTransactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= currentWeekStart && tDate <= adjustedEnd
      })

      const income =
        sumByType(
          weekTransactions.filter((t) => t.type === 'income'),
          'income'
        ) +
        sumByType(
          weekTransactions.filter((t) => t.type === 'refund'),
          'refund'
        )
      const expenses = sumByType(
        weekTransactions.filter((t) => t.type === 'expense'),
        'expense'
      )
      const savings = income - expenses

      const weekNumber = Math.ceil(
        (currentWeekStart.getDate() +
          7 -
          new Date(
            currentWeekStart.getFullYear(),
            currentWeekStart.getMonth(),
            1
          ).getDay()) /
          7
      )
      const label = `Week ${weekNumber}`
      trends.push({ label, income, expenses, savings })

      currentWeekStart.setDate(currentWeekStart.getDate() + 7)
    }
  } else if (granularity === 'month') {
    const currentMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    )
    const maxDate = new Date(endDate)
    maxDate.setHours(23, 59, 59, 999)

    while (currentMonth <= maxDate) {
      const monthStart = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      )
      const monthEnd = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      )
      monthEnd.setHours(23, 59, 59, 999)

      const adjustedEnd = monthEnd > maxDate ? maxDate : monthEnd

      const monthTransactions = validTransactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= monthStart && tDate <= adjustedEnd
      })

      const income =
        sumByType(
          monthTransactions.filter((t) => t.type === 'income'),
          'income'
        ) +
        sumByType(
          monthTransactions.filter((t) => t.type === 'refund'),
          'refund'
        )
      const expenses = sumByType(
        monthTransactions.filter((t) => t.type === 'expense'),
        'expense'
      )
      const savings = income - expenses

      const label = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
      }).format(monthStart)
      trends.push({ label, income, expenses, savings })

      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }
  }

  return trends
}

export function getGranularityForPeriod(
  periodType: 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom'
): 'day' | 'week' | 'month' {
  switch (periodType) {
    case 'thisWeek':
      return 'day'
    case 'thisMonth':
      return 'day'
    case 'thisYear':
      return 'month'
    case 'custom':
      return 'day'
  }
}
