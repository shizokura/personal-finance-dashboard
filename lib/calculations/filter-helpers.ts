import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  CurrencyCode,
  DateRange,
} from '@/lib/types'

export function getMonthDateRange(month: number, year: number): DateRange {
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const endDate = new Date(year, month, 0, 23, 59, 59, 999)
  return { start: startDate, end: endDate }
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  range: DateRange
): Transaction[] {
  return transactions.filter((t) => {
    const txDate = new Date(t.date)
    return txDate >= range.start && txDate <= range.end
  })
}

export function filterTransactionsByStatus(
  transactions: Transaction[],
  status: TransactionStatus
): Transaction[] {
  return transactions.filter((t) => t.status === status)
}

export function filterTransactionsByTypeAndCurrency(
  transactions: Transaction[],
  baseCurrency: CurrencyCode
): Transaction[] {
  const validTypes: TransactionType[] = ['income', 'expense', 'refund']
  return transactions.filter(
    (t) => t.currency === baseCurrency && validTypes.includes(t.type)
  )
}

function sumByType(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0)
}

export { sumByType }
