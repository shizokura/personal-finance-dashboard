import type { Transaction, TransactionStatus } from '@/lib/types'

export function filterTransactionsByStatus(
  transactions: Transaction[],
  status: TransactionStatus
): Transaction[] {
  return transactions.filter((t) => t.status === status)
}
