import type { Transaction } from '@/lib/types'

function sumByType(
  transactions: Transaction[],
  type: Transaction['type']
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0)
}

export { sumByType }
