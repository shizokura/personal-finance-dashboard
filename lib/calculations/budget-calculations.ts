import type {
  Transaction,
  Category,
  CurrencyCode,
  DateRange,
} from '@/lib/types'
import type { BudgetProgress } from '@/lib/types'
import { filterTransactionsByPeriod } from './filter-helpers'
import {
  BUDGET_WARNING_THRESHOLD,
  BUDGET_OVER_THRESHOLD,
} from '@/lib/constants'

export function calculateBudgetProgress(
  transactions: Transaction[],
  categories: Category[],
  range: DateRange,
  baseCurrency: CurrencyCode
): BudgetProgress[] {
  const monthlyTransactions = filterTransactionsByPeriod(transactions, range)
  const filteredByCurrencyAndType = monthlyTransactions.filter(
    (t) => t.currency === baseCurrency && t.type === 'expense'
  )

  const budgetCategories = categories.filter(
    (c) => c.budgetLimit != null && c.budgetLimit > 0
  )

  const progress: BudgetProgress[] = []

  budgetCategories.forEach((category) => {
    const spent = filteredByCurrencyAndType
      .filter((t) => t.categoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0)

    const budgetLimit = category.budgetLimit ?? 0
    const remaining = budgetLimit - spent
    const percentage = budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0

    let status: 'onTrack' | 'warning' | 'overBudget' = 'onTrack'
    if (percentage > BUDGET_OVER_THRESHOLD) {
      status = 'overBudget'
    } else if (percentage >= BUDGET_WARNING_THRESHOLD) {
      status = 'warning'
    }

    progress.push({
      categoryId: category.id,
      categoryName: category.name,
      budgetLimit,
      spent,
      remaining,
      percentage,
      status,
    })
  })

  return progress.sort((a, b) => b.percentage - a.percentage)
}
