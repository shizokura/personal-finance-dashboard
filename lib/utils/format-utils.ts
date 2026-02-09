import type { CurrencyCode } from '@/lib/types'
import { SUPPORTED_CURRENCIES } from '@/lib/types'

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return `${SUPPORTED_CURRENCIES[currency].symbol}${amount.toFixed(2)}`
}
