# Phase 5: Migration & Storage

## Overview

Implement data migration from multi-currency (v1) to single-currency (v2) architecture and update storage schema.

---

## Tasks

### 5.1 Update Storage Schema

**File**: `lib/storage/schema.ts`

- [ ] Add schema version tracking if not present
- [ ] Define current schema version: 2
- [ ] Add `updateSchemaVersion()` function
- [ ] Ensure `STORAGE_KEYS` includes all necessary keys

---

### 5.2 Implement Migration Function

**File**: `lib/storage/schema.ts` (or new `lib/storage/migration.ts`)

- [ ] Create `migrateToV2()` function:

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

- [ ] Add type safety: avoid `as any` if possible, use proper type assertions

---

### 5.3 Add Migration Trigger

**File**: `lib/storage/storage.ts` or `lib/storage/index.ts`

- [ ] On app initialization, check current schema version
- [ ] If version < 2, trigger `migrateToV2()`
- [ ] Handle migration errors gracefully
- [ ] Show loading state during migration if needed
- [ ] Log migration status to console for debugging

---

### 5.4 Add Settings Storage Methods

**File**: `lib/storage/storage.ts`

- [ ] Implement `getSettings()`: retrieve all settings from localStorage
- [ ] Implement `saveSetting(key, value)`: save individual setting
- [ ] Implement `saveSettings(settings)`: save all settings at once
- [ ] Define default settings object:
  ```typescript
  const DEFAULT_SETTINGS = {
    currency: 'USD',
    theme: 'system',
    insightsPeriod: 'thisMonth',
  }
  ```
- [ ] Use `STORAGE_KEYS.SETTINGS` for storage key

---

### 5.5 Add Export/Import Helper Functions

**File**: `lib/storage/export.ts` (new file)

- [ ] Implement `exportData()`: gather all data and create JSON object
- [ ] Format:
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
- [ ] Implement `importData(json)`: validate and import data
- [ ] Validate schema version
- [ ] Validate data structure
- [ ] Merge or replace data based on user choice
- [ ] Return success/error status

---

### 5.6 Add Clear Data Function

**File**: `lib/storage/storage.ts`

- [ ] Implement `clearAllData()`: remove all localStorage keys
- [ ] List of keys to clear:
  - `STORAGE_KEYS.TRANSACTIONS`
  - `STORAGE_KEYS.CATEGORIES`
  - `STORAGE_KEYS.ACCOUNTS`
  - `STORAGE_KEYS.SAVINGS_GOALS`
  - `STORAGE_KEYS.SETTINGS`
- [ ] Or clear all localStorage: `localStorage.clear()`
- [ ] Return success status

---

### 5.7 Update Storage Keys

**File**: `lib/storage/keys.ts`

- [ ] Verify all necessary keys are defined
- [ ] Ensure `SETTINGS` key is present
- [ ] Add any missing keys:
  - `TRANSACTIONS`
  - `CATEGORIES`
  - `ACCOUNTS`
  - `SAVINGS_GOALS`
  - `SETTINGS`
  - `SCHEMA_VERSION` (new)

---

### 5.8 Test Migration

- [ ] Create test data with old schema (v1) including currency fields
- [ ] Run migration function
- [ ] Verify currency is removed from transactions
- [ ] Verify currency is removed from savings goals
- [ ] Verify `settings.currency` is set to default USD
- [ ] Verify schema version is updated to 2
- [ ] Test with empty localStorage (new user)
- [ ] Test with existing data (existing user)

---

### 5.9 Test Export/Import

- [ ] Test export: verify JSON format is correct
- [ ] Test import with valid JSON: verify data loads correctly
- [ ] Test import with invalid JSON: verify error handling
- [ ] Test merge vs replace options
- [ ] Test that settings are preserved/exported correctly

---

### 5.10 Test Clear Data

- [ ] Test clear function: verify all localStorage is cleared
- [ ] Verify app handles empty state gracefully
- [ ] Verify first-time currency modal appears after clear

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
