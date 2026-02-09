import type { Transaction } from '@/lib/types'

export function filterTransactionsBySearch(
  transactions: Transaction[],
  query: string
): Transaction[] {
  if (!query.trim()) {
    return transactions
  }

  const searchTerm = query.toLowerCase()

  return transactions.filter((t) => {
    const matchesDescription = t.description.toLowerCase().includes(searchTerm)
    const matchesNotes = t.metadata?.notes?.toLowerCase().includes(searchTerm)

    return matchesDescription || matchesNotes
  })
}
