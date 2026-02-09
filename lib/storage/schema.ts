import { STORAGE_KEYS } from './keys'

export const CURRENT_SCHEMA_VERSION = 1

export type SchemaVersion = number

function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

export function checkSchemaVersion(): SchemaVersion {
  if (!isClientSide()) return 0

  try {
    const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)
    return version ? parseInt(version, 10) : 0
  } catch (error) {
    console.error('Failed to check schema version:', error)
    return 0
  }
}

export function updateSchemaVersion(version: number): void {
  if (!isClientSide()) return

  try {
    localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, version.toString())
  } catch (error) {
    console.error('Failed to update schema version:', error)
  }
}

export function migrate(): void {
  if (!isClientSide()) return

  const currentVersion = checkSchemaVersion()

  if (currentVersion === CURRENT_SCHEMA_VERSION) {
    return
  }

  console.log(
    `Migrating from schema v${currentVersion} to v${CURRENT_SCHEMA_VERSION}`
  )

  if (currentVersion < 1) {
    migrateToV1()
  }

  updateSchemaVersion(CURRENT_SCHEMA_VERSION)
}

function migrateToV1(): void {
  console.log('Running migration to v1')

  try {
    const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    const accounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)

    if (transactions) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions)
    }
    if (categories) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, categories)
    }
    if (accounts) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, accounts)
    }
    if (settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, settings)
    }
  } catch (error) {
    console.error('Migration to v1 failed:', error)
  }
}
