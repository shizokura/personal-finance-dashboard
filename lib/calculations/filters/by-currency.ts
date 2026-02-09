import type { Transaction, CurrencyCode } from '@/lib/types'

export function filterTransactionsByTypeAndCurrency(
  transactions: Transaction[],
  baseCurrency: CurrencyCode
): Transaction[] {
  const validTypes = ['income', 'expense', 'refund']
  return transactions.filter(
    (t) => t.currency === baseCurrency && validTypes.includes(t.type)
  )
}
