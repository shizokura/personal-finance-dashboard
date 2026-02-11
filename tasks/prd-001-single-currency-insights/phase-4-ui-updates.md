# Phase 4: UI Component Updates

## Overview

Update existing UI components to remove multi-currency features and align with single-currency architecture.

---

## Tasks

### 4.1 Update Transaction Form

**File**: `components/TransactionForm.tsx`

- [x] Remove currency dropdown/selector component
- [x] Remove `currency` state from form
- [x] Remove currency from form validation
- [x] Update form submission to not include currency
- [x] Update TypeScript interface to use `TransactionFormData` without currency
- [x] Add helper text: "Amount in {selectedCurrency}" - fetch from settings
- [x] Verify form still submits correctly

---

### 4.2 Update Header Component

**File**: `components/Header.tsx`

- [x] Remove `<ThemeToggle />` import
- [x] Remove `<ThemeToggle />` from desktop navigation (line 76)
- [x] Remove `<ThemeToggle />` from mobile menu
- [x] Verify Settings link is present in both desktop and mobile
- [x] Add Insights link to navigation
- [x] Test navigation links work correctly

---

### 4.3 Update Dashboard Components

**File**: `components/dashboard/MonthlyTrendChart.tsx`

- [x] Remove any `baseCurrency` parameters or props
- [x] Update to use single currency from settings
- [x] Verify chart displays correctly

**File**: `components/dashboard/BudgetProgressCard.tsx`

- [x] Verify currency display uses settings currency (file does not exist)
- [x] Check if any currency filtering needs removal (file does not exist)

---

### 4.4 Update Transaction Components

**File**: `components/transactions/TransactionList.tsx`

- [x] Remove currency column from display if present
- [x] Ensure all amounts display with settings currency symbol

**File**: `components/transactions/TransactionCard.tsx`

- [x] Remove currency display if separate from amount
- [x] Ensure amount formatting uses settings currency

---

### 4.5 Update Savings Components

**File**: `components/savings/SavingsGoalCard.tsx` (if exists)

- [x] Remove currency selector/field (file does not exist)
- [x] Use settings currency for all amounts (file does not exist)
- [x] Update form submission to not include currency (file does not exist)

---

### 4.6 Update Storage Implementation

**File**: `lib/storage/storage-service.ts`

- [x] Ensure transaction serialization doesn't include currency field
- [x] Ensure savings goals serialization doesn't include currency field
- [x] Add `getSetting()` and `saveSetting()` methods if not present
- [x] Verify `STORAGE_KEYS.SETTINGS` is correct

---

### 4.7 Update Calculation Helpers

**File**: `lib/calculations/filter-helpers.ts`

- [x] Ensure no currency filtering functions remain
- [x] Update exports if needed

**File**: `lib/calculations/monthly-summary.ts`

- [x] Verify `baseCurrency` parameter is removed from all functions
- [x] Update any internal references to currency

---

### 4.8 Update Types Exports

**File**: `lib/types/index.ts` (or equivalent)

- [x] Export `UserSettings` interface
- [x] Export `PeriodType` type
- [x] Ensure `CurrencyCode` and `SUPPORTED_CURRENCIES` are exported
- [x] Verify all transaction types don't include currency

---

## Verification

- [x] Run `npx tsc --noEmit` - verify no type errors
- [x] Run `npm run lint` - verify no linting errors
- [x] Test TransactionForm in browser:
  - [x] Add new transaction
  - [x] Edit existing transaction
  - [x] Verify currency is not shown
  - [x] Verify amount uses correct currency symbol
- [x] Test Header in browser:
  - [x] Verify ThemeToggle is removed
  - [x] Verify Settings link works
  - [x] Verify Insights link works
- [x] Test Dashboard:
  - [x] Verify all charts display correctly
  - [x] Verify currency is consistent

---

## Success Criteria

- [x] TransactionForm has no currency selector
- [x] All amounts use settings currency
- [x] Header has no ThemeToggle
- [x] Settings and Insights links in navigation
- [x] Dashboard components work without currency parameters
- [x] Transaction components display amounts correctly
- [x] Savings components use settings currency
- [x] Storage doesn't serialize currency fields
- [x] TypeScript compiles without errors
- [x] ESLint passes

---

## Status

**Phase 4 Complete ✅**

All UI components have been updated to align with single-currency architecture:

- TransactionForm now uses settings currency with helper text
- MonthlyTrendChart uses dynamic currency from settings
- TransactionCard displays amounts with settings currency
- All code passes TypeScript type checking
- All lint warnings addressed (only unrelated warning in seed-data.ts remains)

---

## Dependencies

- **Phase 1**: Type definitions must be updated first
- **Phase 2**: Settings page must exist for currency reference

---

## Estimated Time

2-3 hours
