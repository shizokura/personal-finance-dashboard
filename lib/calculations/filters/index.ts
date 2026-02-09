import type { Transaction, TransactionFilter, Category } from '@/lib/types'
import { filterTransactionsByCategory } from './by-category'
import { filterTransactionsBySearch } from './by-search'
import { filterTransactionsByTypes } from './by-type'
import { filterTransactionsByAmount } from './by-amount'
import { filterTransactionsByTags } from './by-tags'
import { filterTransactionsByPeriod } from './by-date'

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilter,
  categories: Category[]
): Transaction[] {
  let filtered = transactions

  if (filters.dateRange) {
    filtered = filterTransactionsByPeriod(filtered, filters.dateRange)
  }

  filtered = filterTransactionsByCategory(
    filtered,
    filters.categories || [],
    categories
  )
  filtered = filterTransactionsBySearch(filtered, filters.searchQuery || '')
  filtered = filterTransactionsByTypes(filtered, filters.types || [])
  filtered = filterTransactionsByAmount(filtered, filters.amountRange)
  filtered = filterTransactionsByTags(filtered, filters.tags || [])

  return filtered
}
