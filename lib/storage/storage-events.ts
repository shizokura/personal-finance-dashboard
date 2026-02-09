export type StorageEventType =
  | 'categories'
  | 'transactions'
  | 'accounts'
  | 'settings'
  | 'savingsGoals'

export type StorageEventData = {
  categories?: {
    action: 'create' | 'update' | 'delete'
    categoryId?: string
  }
  transactions?: {
    action: 'create' | 'update' | 'delete'
    transactionId?: string
  }
  accounts?: {
    action: 'create' | 'update' | 'delete'
  }
  settings?: {
    action: 'create' | 'update' | 'delete'
    key?: string
  }
  savingsGoals?: {
    action: 'create' | 'update' | 'delete'
    savingsGoalId?: string
  }
}

export type StorageEventCallback = (data: StorageEventData) => void

class StorageEvents {
  private listeners: Map<StorageEventType, Set<StorageEventCallback>> =
    new Map()

  on(event: StorageEventType, callback: StorageEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => this.off(event, callback)
  }

  off(event: StorageEventType, callback: StorageEventCallback): void {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: StorageEventType, data?: StorageEventData): void {
    this.listeners.get(event)?.forEach((callback) => callback(data || {}))
  }
}

export const storageEvents = new StorageEvents()
