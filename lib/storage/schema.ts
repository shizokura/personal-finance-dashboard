import { STORAGE_KEYS } from './keys'
import type { SavingsGoal } from '@/lib/types'

export const CURRENT_SCHEMA_VERSION = 3

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

  if (currentVersion < 2) {
    migrateToV2()
  }

  if (currentVersion < 3) {
    migrateToV3()
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

function migrateToV2(): void {
  console.log('Running migration to v2')

  try {
    const savingsGoals = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS)
    if (!savingsGoals) {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Migration to v2 failed:', error)
  }
}

function migrateToV3(): void {
  console.log('Running migration to v3')

  try {
    const savingsGoals = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS)
    if (savingsGoals) {
      let goals: unknown
      try {
        goals = JSON.parse(savingsGoals)
      } catch (parseError) {
        console.error(
          'Failed to parse savings goals during v3 migration:',
          parseError
        )
        localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify([]))
        return
      }

      if (!Array.isArray(goals)) {
        console.error('Savings goals is not an array during v3 migration')
        localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify([]))
        return
      }

      const updatedGoals: SavingsGoal[] = []
      for (const goal of goals) {
        try {
          if (goal && typeof goal === 'object' && 'id' in goal) {
            updatedGoals.push({
              ...goal,
              processedTransactionIds: goal.processedTransactionIds || [],
              deadline: goal.deadline
                ? new Date(goal.deadline as string)
                : undefined,
              createdAt: new Date(goal.createdAt as string),
              updatedAt: new Date(goal.updatedAt as string),
            } as SavingsGoal)
          }
        } catch (goalError) {
          console.warn(
            `Skipping malformed savings goal during v3 migration:`,
            goalError
          )
        }
      }

      localStorage.setItem(
        STORAGE_KEYS.SAVINGS_GOALS,
        JSON.stringify(updatedGoals)
      )
    }
  } catch (error) {
    console.error('Migration to v3 failed:', error)
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify([]))
  }
}
