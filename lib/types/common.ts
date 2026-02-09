export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'CNY'
  | 'INR'
  | 'MXN'
  | 'BRL'
  | 'KRW'
  | 'SGD'
  | 'HKD'
  | 'NZD'

export interface Currency {
  code: CurrencyCode
  symbol: string
  name: string
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  SGD: { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  HKD: { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
  NZD: { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
}

export type DateRange = {
  start: Date
  end: Date
}

export type DateFilter =
  | 'today'
  | 'thisWeek'
  | 'thisMonth'
  | 'thisYear'
  | 'allTime'
  | 'custom'

export type ChartViewType = 'pie' | 'bar' | 'list'

export interface PaginationOptions {
  page: number
  limit: number
  offset: number
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface Attachment {
  id: string
  filename: string
  url: string
  mimetype: string
  size: number
  uploadedAt: Date
}

export interface Metadata {
  notes?: string
  tags?: string[]
  location?: {
    name?: string
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
}
