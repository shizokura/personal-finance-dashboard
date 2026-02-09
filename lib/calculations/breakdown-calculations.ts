import type { Transaction, TransactionType, Category } from '@/lib/types'
import type {
  CategoryBreakdown,
  SubcategoryBreakdown,
  TopTransaction,
} from '@/lib/types'
import { TOP_TRANSACTIONS_LIMIT } from '@/lib/constants'

export function calculateCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  type: TransactionType
): CategoryBreakdown[] {
  const filtered = transactions.filter((t) => t.type === type)
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const grouped = new Map<string, { amount: number; count: number }>()

  filtered.forEach((t) => {
    const category = categoryMap.get(t.categoryId)
    if (!category) return

    const existing = grouped.get(t.categoryId)
    if (existing) {
      existing.amount += t.amount
      existing.count += 1
    } else {
      grouped.set(t.categoryId, { amount: t.amount, count: 1 })
    }
  })

  const total = filtered.reduce((sum, t) => sum + t.amount, 0)
  const breakdown: CategoryBreakdown[] = []

  grouped.forEach((data, categoryId) => {
    const category = categoryMap.get(categoryId)
    if (!category) return

    breakdown.push({
      categoryId,
      categoryName: category.name,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      transactionCount: data.count,
      color: category.color,
    })
  })

  return breakdown.sort((a, b) => b.amount - a.amount)
}

export function calculateSubcategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  type: TransactionType
): SubcategoryBreakdown[] {
  const filtered = transactions.filter(
    (t) => t.type === type && t.subcategoryId != null
  )
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const grouped = new Map<string, { amount: number; count: number }>()

  filtered.forEach((t) => {
    if (!t.subcategoryId) return

    const existing = grouped.get(t.subcategoryId)
    if (existing) {
      existing.amount += t.amount
      existing.count += 1
    } else {
      grouped.set(t.subcategoryId, { amount: t.amount, count: 1 })
    }
  })

  const total = filtered.reduce((sum, t) => sum + t.amount, 0)
  const breakdown: SubcategoryBreakdown[] = []

  grouped.forEach((data, subcategoryId) => {
    const transaction = filtered.find((t) => t.subcategoryId === subcategoryId)
    if (!transaction || !transaction.subcategoryId) return

    const parentCategory = categoryMap.get(transaction.categoryId)
    if (!parentCategory) return

    const subcategoryName =
      parentCategory.children?.find((c) => c.id === subcategoryId)?.name ||
      'Unknown Subcategory'

    breakdown.push({
      subcategoryId,
      subcategoryName,
      parentId: transaction.categoryId,
      parentName: parentCategory.name,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      transactionCount: data.count,
    })
  })

  return breakdown.sort((a, b) => b.amount - a.amount)
}

export function calculateTopTransactions(
  transactions: Transaction[],
  categories: Category[],
  type: TransactionType,
  limit: number = TOP_TRANSACTIONS_LIMIT
): TopTransaction[] {
  const filtered = transactions.filter((t) => t.type === type)
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const sorted = [...filtered]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)

  return sorted.map((t) => {
    const category = categoryMap.get(t.categoryId)
    return {
      id: t.id,
      description: t.description,
      amount: t.amount,
      categoryId: t.categoryId,
      categoryName: category?.name || 'Unknown Category',
      date: t.date,
    }
  })
}
