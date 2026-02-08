export const STORAGE_PREFIX = 'pfd_'

export const STORAGE_KEYS = {
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  CATEGORIES: `${STORAGE_PREFIX}categories`,
  ACCOUNTS: `${STORAGE_PREFIX}accounts`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  SCHEMA_VERSION: `${STORAGE_PREFIX}schema_version`,
} as const
