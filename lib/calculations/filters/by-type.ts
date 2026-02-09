import type { Transaction, TransactionType } from '@/lib/types'

export function filterTransactionsByTypes(
  transactions: Transaction[],
  types: TransactionType[]
): Transaction[] {
  if (types.length === 0) {
    return transactions
  }
  return transactions.filter((t) => types.includes(t.type))
}
