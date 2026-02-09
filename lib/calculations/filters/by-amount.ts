import type { Transaction } from '@/lib/types'

export function filterTransactionsByAmount(
  transactions: Transaction[],
  amountRange?: { min?: number; max?: number }
): Transaction[] {
  if (!amountRange) {
    return transactions
  }
  return transactions.filter((t) => {
    if (amountRange.min !== undefined && t.amount < amountRange.min) {
      return false
    }
    if (amountRange.max !== undefined && t.amount > amountRange.max) {
      return false
    }
    return true
  })
}
