# Phase 5: Migration & Storage

## Overview

Implement data migration from multi-currency (v1) to single-currency (v2) architecture and update storage schema.

**Status:** ✅ **COMPLETED**

---

## Tasks

### 5.1 Update Storage Schema

**File**: `lib/storage/schema.ts`

- [x] Add schema version tracking if not present
- [x] Define current schema version: 2 (actually v4)
- [x] Add `updateSchemaVersion()` function
- [x] Ensure `STORAGE_KEYS` includes all necessary keys

---

### 5.2 Implement Migration Function

**File**: `lib/storage/schema.ts` (or new `lib/storage/migration.ts`)

- [x] Create `migrateToV2()` function:

```typescript
export function migrateToV2(): void {
  const settings = storage.getSettings()
  const transactions = storage.getTransactions()
  const savingsGoals = storage.getSavingsGoals()

  // If currency not set, default to USD
  if (!settings.currency) {
    settings.currency = 'USD'
  }

  // Remove currency from transactions (it's now implied by settings.currency)
  const cleanedTransactions = transactions.map((t) => {
    const { currency, ...rest } = t as any
    return rest
  })

  const cleanedGoals = savingsGoals.map((g) => {
    const { currency, ...rest } = g as any
    return rest
  })

  storage.saveTransactions(cleanedTransactions)
  storage.saveSavingsGoals(cleanedGoals)
  storage.saveSetting('currency', settings.currency)

  updateSchemaVersion(2)
}
```

- [x] Add type safety: avoid `as any` if possible, use proper type assertions

---

### 5.3 Add Migration Trigger

**File**: `lib/storage/storage.ts` or `lib/storage/index.ts`

- [x] On app initialization, check current schema version
- [x] If version < 2, trigger `migrateToV2()`
- [x] Handle migration errors gracefully
- [x] Show loading state during migration if needed
- [x] Log migration status to console for debugging

---

### 5.4 Add Settings Storage Methods

**File**: `lib/storage/storage.ts`

- [x] Implement `getSettings()`: retrieve all settings from localStorage
- [x] Implement `saveSetting(key, value)`: save individual setting
- [x] Implement `saveSettings(settings)`: save all settings at once
- [x] Define default settings object:
  ```typescript
  const DEFAULT_SETTINGS = {
    currency: 'USD',
    theme: 'system',
    insightsPeriod: 'thisMonth',
  }
  ```
- [x] Use `STORAGE_KEYS.SETTINGS` for storage key

---

### 5.5 Add Export/Import Helper Functions

**File**: `lib/storage/export.ts` (new file)

- [x] Implement `exportData()`: gather all data and create JSON object
- [x] Format:
  ```json
  {
    "version": "2.0",
    "exportedAt": "2026-02-10T12:00:00Z",
    "data": {
      "transactions": [...],
      "categories": [...],
      "accounts": [...],
      "savingsGoals": [...]
    }
  }
  ```
- [x] Implement `importData(json)`: validate and import data
- [x] Validate schema version
- [x] Validate data structure
- [x] Merge or replace data based on user choice
- [x] Return success/error status

---

### 5.6 Add Clear Data Function

**File**: `lib/storage/storage.ts`

- [x] Implement `clearAllData()`: remove all localStorage keys
- [x] List of keys to clear:
  - `STORAGE_KEYS.TRANSACTIONS`
  - `STORAGE_KEYS.CATEGORIES`
  - `STORAGE_KEYS.ACCOUNTS`
  - `STORAGE_KEYS.SAVINGS_GOALS`
  - `STORAGE_KEYS.SETTINGS`
- [x] Or clear all localStorage: `localStorage.clear()`
- [x] Return success status

---

### 5.7 Update Storage Keys

**File**: `lib/storage/keys.ts`

- [x] Verify all necessary keys are defined
- [x] Ensure `SETTINGS` key is present
- [x] Add any missing keys:
  - `TRANSACTIONS`
  - `CATEGORIES`
  - `ACCOUNTS`
  - `SAVINGS_GOALS`
  - `SETTINGS`
  - `SCHEMA_VERSION` (new)

---

### 5.8 Test Migration

- [x] Create test data with old schema (v1) including currency fields
- [x] Run migration function
- [x] Verify currency is removed from transactions
- [x] Verify currency is removed from savings goals
- [x] Verify `settings.currency` is set to default USD
- [x] Verify schema version is updated to 2
- [x] Test with empty localStorage (new user)
- [x] Test with existing data (existing user)

---

### 5.9 Test Export/Import

- [x] Test export: verify JSON format is correct
- [x] Test import with valid JSON: verify data loads correctly
- [x] Test import with invalid JSON: verify error handling
- [x] Test merge vs replace options
- [x] Test that settings are preserved/exported correctly

---

### 5.10 Test Clear Data

- [x] Test clear function: verify all localStorage is cleared
- [x] Verify app handles empty state gracefully
- [x] Verify first-time currency modal appears after clear

---

## Success Criteria

- ✅ Schema version tracking implemented
- ✅ `migrateToV2()` function works correctly
- ✅ Migration triggers automatically on app load
- ✅ Currency fields removed from transactions and goals
- ✅ Settings stored/retrieved correctly
- ✅ Default settings applied when not set
- ✅ Export creates valid JSON with correct format
- ✅ Import validates and loads data correctly
- ✅ Clear all data removes everything
- ✅ Migration tested with v1 data and empty data

---

## Dependencies

- **Phase 1**: Type definitions must be updated
- **Phase 2**: Settings page should exist to test settings storage

---

## Estimated Time

2-3 hours

---

## Implementation Notes

**Completed:** February 12, 2026

All Phase 5 tasks have been completed. The storage system now includes:

1. Schema version tracking (currently at v4, includes migration functions for v1-v4)
2. Full settings management with `getSettings()`, `saveSetting()`, and `saveSettings()`
3. `DEFAULT_SETTINGS` constant for consistent defaults (currency: USD, theme: system, insightsPeriod: thisMonth)
4. Export/Import functionality in `DataManagement.tsx`
5. Clear data function in `StorageService.clear()`
6. All required STORAGE_KEYS defined

Note: The PRD mentioned schema v2, but the actual implementation is at v4 because migrations were implemented incrementally over time. The currency field removal was completed before schema versioning was established.
