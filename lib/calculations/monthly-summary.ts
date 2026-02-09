import type { Transaction, Category, CurrencyCode } from '@/lib/types'
import type { MonthlySummary, MonthlyTransactionStats } from '@/lib/types'
import {
  getMonthDateRange,
  filterTransactionsByPeriod,
  filterTransactionsByStatus,
  filterTransactionsByTypeAndCurrency,
  sumByType,
} from './filter-helpers'
import {
  calculateCategoryBreakdown,
  calculateSubcategoryBreakdown,
  calculateTopTransactions,
} from './breakdown-calculations'
import { calculateBudgetProgress } from './budget-calculations'

function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0
  return ((income - expenses) / income) * 100
}

function calculateTotalBalance(
  transactions: Transaction[],
  baseCurrency: CurrencyCode
): number {
  const validTypes = ['income', 'expense', 'refund']
  const completedTransactions = transactions.filter(
    (t) => t.status === 'completed' && t.currency === baseCurrency
  )

  return completedTransactions.reduce((balance, t) => {
    if (!validTypes.includes(t.type as 'income' | 'expense' | 'refund'))
      return balance
    if (t.type === 'income' || t.type === 'refund') {
      return balance + t.amount
    }
    if (t.type === 'expense') {
      return balance - t.amount
    }
    return balance
  }, 0)
}

function calculateTransactionStats(
  transactions: Transaction[]
): MonthlyTransactionStats {
  const totalTransactions = transactions.length
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const averageTransactionAmount =
    totalTransactions > 0 ? totalAmount / totalTransactions : 0

  const byType: Record<
    string,
    { count: number; total: number; average: number }
  > = {
    income: { count: 0, total: 0, average: 0 },
    expense: { count: 0, total: 0, average: 0 },
    transfer: { count: 0, total: 0, average: 0 },
    refund: { count: 0, total: 0, average: 0 },
    recurring: { count: 0, total: 0, average: 0 },
  }

  transactions.forEach((t) => {
    const typeStats = byType[t.type]
    if (typeStats) {
      typeStats.count += 1
      typeStats.total += t.amount
    }
  })

  Object.keys(byType).forEach((key) => {
    const typeStats = byType[key]
    if (typeStats.count > 0) {
      typeStats.average = typeStats.total / typeStats.count
    }
  })

  return {
    totalTransactions,
    averageTransactionAmount,
    byType: byType as MonthlyTransactionStats['byType'],
  }
}

export function calculateMonthlySummary(
  month: number,
  year: number,
  transactions: Transaction[],
  categories: Category[],
  baseCurrency: CurrencyCode = 'USD'
): MonthlySummary {
  const period = getMonthDateRange(month, year)
  const { start: startDate, end: endDate } = period

  const monthlyTransactions = filterTransactionsByPeriod(transactions, period)
  const completedTransactions = filterTransactionsByStatus(
    monthlyTransactions,
    'completed'
  )
  const validTransactions = filterTransactionsByTypeAndCurrency(
    completedTransactions,
    baseCurrency
  )

  const incomeTransactions = validTransactions.filter(
    (t) => t.type === 'income'
  )
  const expenseTransactions = validTransactions.filter(
    (t) => t.type === 'expense'
  )
  const refundTransactions = validTransactions.filter(
    (t) => t.type === 'refund'
  )

  const monthlyIncome =
    sumByType(incomeTransactions, 'income') +
    sumByType(refundTransactions, 'refund')
  const monthlyExpenses = sumByType(expenseTransactions, 'expense')
  const netSavings = monthlyIncome - monthlyExpenses
  const savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpenses)
  const totalBalance = calculateTotalBalance(transactions, baseCurrency)

  const expenseBreakdown = {
    total: monthlyExpenses,
    byCategory: calculateCategoryBreakdown(
      validTransactions,
      categories,
      'expense'
    ),
    bySubcategory: calculateSubcategoryBreakdown(
      validTransactions,
      categories,
      'expense'
    ),
    topExpenses: calculateTopTransactions(
      validTransactions,
      categories,
      'expense',
      5
    ),
  }

  const incomeBreakdown = {
    total: monthlyIncome,
    byCategory: calculateCategoryBreakdown(
      validTransactions,
      categories,
      'income'
    ),
    bySubcategory: calculateSubcategoryBreakdown(
      validTransactions,
      categories,
      'income'
    ),
    topIncome: calculateTopTransactions(
      validTransactions,
      categories,
      'income',
      5
    ),
  }

  const transactionStats = calculateTransactionStats(validTransactions)
  const budgetProgress = calculateBudgetProgress(
    transactions,
    categories,
    period,
    baseCurrency
  )

  return {
    period: {
      month,
      year,
      startDate,
      endDate,
    },
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    netSavings,
    savingsRate,
    expenseBreakdown,
    incomeBreakdown,
    transactionStats,
    budgetProgress,
  }
}
