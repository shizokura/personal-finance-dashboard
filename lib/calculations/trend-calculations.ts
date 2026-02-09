import type { Transaction, Category, CurrencyCode } from '@/lib/types'
import type { MonthlyTrend, TrendComparison } from '@/lib/types'
import { calculateMonthlySummary } from './monthly-summary'

export function calculateMonthlyTrends(
  transactions: Transaction[],
  categories: Category[],
  months: number = 6,
  baseCurrency: CurrencyCode = 'USD'
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
      categories,
      baseCurrency
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
