import type { Transaction } from '@/lib/types'

export function filterTransactionsByTags(
  transactions: Transaction[],
  tags: string[]
): Transaction[] {
  if (tags.length === 0) {
    return transactions
  }
  return transactions.filter((t) => {
    const txnTags = t.metadata?.tags || []
    return tags.some((tag) => txnTags.includes(tag))
  })
}
