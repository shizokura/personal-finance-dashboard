import type { Attachment, CurrencyCode, Metadata } from './common'

export type TransactionType = 'income' | 'expense' | 'transfer' | 'refund' | 'recurring'

export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed'

export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: CurrencyCode
  date: Date
  description: string
  categoryId: string
  subcategoryId?: string
  accountId?: string
  transferToAccountId?: string
  attachments: Attachment[]
  metadata: Metadata
  createdAt: Date
  updatedAt: Date
}

export interface RecurringTransaction extends Omit<Transaction, 'type'> {
  type: 'recurring'
  frequency: RecurringFrequency
  interval: number
  nextOccurrence: Date
  endDate?: Date
  generatedTransactions: string[]
  isActive: boolean
}

export interface TransactionFormData {
  type: TransactionType
  amount: number
  currency: CurrencyCode
  date: Date
  description: string
  categoryId: string
  subcategoryId?: string
  accountId?: string
  transferToAccountId?: string
  attachments: File[]
  notes?: string
  tags?: string[]
  location?: {
    name?: string
  }
}

export interface TransactionFilter {
  types?: TransactionType[]
  categories?: string[]
  accounts?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  amountRange?: {
    min?: number
    max?: number
  }
  searchQuery?: string
  tags?: string[]
}

export interface TransactionStats {
  total: number
  averageAmount: number
  byType: Record<TransactionType, number>
  byCategory: Record<string, number>
}
