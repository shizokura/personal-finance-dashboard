import type { Category, Transaction } from '@/lib/types'
import { STORAGE_KEYS } from './keys'
import { checkSchemaVersion, migrate } from './schema'
import { storageEvents } from './storage-events'

class StorageService {
  private initialized = false

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    if (this.initialized) {
      return
    }

    const version = checkSchemaVersion()
    if (version < 1) {
      migrate()
    }

    this.initialized = true
  }

  private isClientSide(): boolean {
    return typeof window !== 'undefined'
  }

  private get<T>(key: string, defaultValue: T): T {
    if (!this.isClientSide()) return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch (error) {
      console.error(`Failed to get ${key}:`, error)
      return defaultValue
    }
  }

  private set<T>(key: string, value: T): void {
    if (!this.isClientSide()) return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to set ${key}:`, error)
    }
  }

  private remove(key: string): void {
    if (!this.isClientSide()) return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error)
    }
  }

  clear(): void {
    if (!this.isClientSide()) return

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      this.initialized = false
      this.initialize()
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }

  getTransactions(): Transaction[] {
    const transactions = this.get<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, [])
    return transactions.map((txn) => ({
      ...txn,
      date: new Date(txn.date),
      createdAt: new Date(txn.createdAt),
      updatedAt: new Date(txn.updatedAt),
    }))
  }

  saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions()
    const existingIndex = transactions.findIndex((t) => t.id === transaction.id)

    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction
    } else {
      transactions.push(transaction)
    }

    this.set(STORAGE_KEYS.TRANSACTIONS, transactions)
    storageEvents.emit('transactions', {
      transactions: { action: 'update', transactionId: transaction.id },
    })
  }

  saveTransactions(transactions: Transaction[]): void {
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions)
    storageEvents.emit('transactions', { transactions: { action: 'update' } })
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions().filter((t) => t.id !== id)
    this.set(STORAGE_KEYS.TRANSACTIONS, transactions)
    storageEvents.emit('transactions', {
      transactions: { action: 'delete', transactionId: id },
    })
  }

  getCategories(): Category[] {
    const categories = this.get<Category[]>(STORAGE_KEYS.CATEGORIES, [])
    return categories.map((cat) => ({
      ...cat,
      createdAt: new Date(cat.createdAt),
      updatedAt: new Date(cat.updatedAt),
    }))
  }

  saveCategory(category: Category): void {
    const categories = this.getCategories()
    const existingIndex = categories.findIndex((c) => c.id === category.id)

    if (existingIndex >= 0) {
      categories[existingIndex] = category
    } else {
      categories.push(category)
    }

    this.set(STORAGE_KEYS.CATEGORIES, categories)
    storageEvents.emit('categories', {
      categories: {
        action: existingIndex >= 0 ? 'update' : 'create',
        categoryId: category.id,
      },
    })
  }

  saveCategories(categories: Category[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, categories)
    storageEvents.emit('categories', { categories: { action: 'update' } })
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id)
    this.set(STORAGE_KEYS.CATEGORIES, categories)
    storageEvents.emit('categories', {
      categories: { action: 'delete', categoryId: id },
    })
  }

  getAccounts(): string[] {
    return this.get<string[]>(STORAGE_KEYS.ACCOUNTS, [])
  }

  saveAccounts(accounts: string[]): void {
    this.set(STORAGE_KEYS.ACCOUNTS, accounts)
    storageEvents.emit('accounts', { accounts: { action: 'update' } })
  }

  getSettings(): Record<string, unknown> {
    return this.get<Record<string, unknown>>(STORAGE_KEYS.SETTINGS, {})
  }

  saveSetting(key: string, value: unknown): void {
    const settings = this.getSettings()
    settings[key] = value
    this.set(STORAGE_KEYS.SETTINGS, settings)
    storageEvents.emit('settings', { settings: { action: 'update', key } })
  }

  removeSetting(key: string): void {
    const settings = this.getSettings()
    delete settings[key]
    this.set(STORAGE_KEYS.SETTINGS, settings)
    storageEvents.emit('settings', { settings: { action: 'delete', key } })
  }
}

export { StorageService }
export const storage = new StorageService()

export default storage
