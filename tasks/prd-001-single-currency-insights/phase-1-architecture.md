# Phase 1: Architecture Changes & Data Model

## Overview

Remove multi-currency support and update data types to use single currency model.

---

## Tasks

### 1.1 Update Type Definitions

**File**: `lib/types/common.ts`

- [x] Keep `CurrencyCode` type and `SUPPORTED_CURRENCIES` (no changes needed)
- [x] Verify these are exported correctly for Settings page use

**File**: `lib/types/transaction.ts`

- [x] Remove `currency: CurrencyCode` from `Transaction` interface
- [x] Remove `currency: CurrencyCode` from `TransactionFormData` interface
- [x] Remove `currency: CurrencyCode` from `SavingsGoal` interface
- [x] Export types remain in `@/lib/types`

**File**: `lib/types/summary.ts`

- [x] Add new `UserSettings` interface:
  ```typescript
  interface UserSettings {
    currency: CurrencyCode
    theme: 'light' | 'dark' | 'system'
    insightsPeriod: PeriodType
  }
  type PeriodType = 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom'
  ```

---

### 1.2 Update Calculation Functions

**File**: `lib/calculations/monthly-summary.ts`

- [x] Remove `baseCurrency` parameter from `calculateMonthlySummary()` (line 90)
- [x] Remove currency filtering in `calculateTotalBalance()` (lines 24-41)
- [x] Update all callers to remove `baseCurrency` argument

**File**: `lib/calculations/trend-calculations.ts`

- [x] Remove `baseCurrency` parameter from `calculateMonthlyTrends()` (lines 5-47)
- [x] Update all callers to remove `baseCurrency` argument

**File**: `lib/calculations/filter-helpers.ts`

- [x] Remove `filterTransactionsByTypeAndCurrency()` function
- [x] Update all callers to use `filterTransactionsByType()` instead

---

### 1.3 Remove Currency Filtering

**File**: `lib/calculations/filters/by-currency.ts`

- [x] Delete this entire file
- [x] Remove any imports of this file across the codebase

---

### 1.4 Verify Compilation

- [x] Run `npx tsc --noEmit` - verify no type errors after changes
- [x] Run `npm run lint` - verify no linting errors
- [x] Search for any remaining `currency` usage in calculation files that needs removal

---

## Success Criteria

- ✅ All type definitions updated (no `currency` in Transaction, TransactionFormData, SavingsGoal)
- ✅ UserSettings interface added with currency, theme, insightsPeriod
- ✅ All calculation functions updated to remove currency filtering
- ✅ TypeScript compiles without errors
- ✅ ESLint passes

---

## Dependencies

None - this is the first phase

---

## Estimated Time

1-2 hours
