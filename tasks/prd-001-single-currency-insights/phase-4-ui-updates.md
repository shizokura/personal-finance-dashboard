# Phase 4: UI Component Updates

## Overview

Update existing UI components to remove multi-currency features and align with single-currency architecture.

---

## Tasks

### 4.1 Update Transaction Form

**File**: `components/TransactionForm.tsx`

- [ ] Remove currency dropdown/selector component
- [ ] Remove `currency` state from form
- [ ] Remove currency from form validation
- [ ] Update form submission to not include currency
- [ ] Update TypeScript interface to use `TransactionFormData` without currency
- [ ] Add helper text: "Amount in {selectedCurrency}" - fetch from settings
- [ ] Verify form still submits correctly

---

### 4.2 Update Header Component

**File**: `components/Header.tsx`

- [ ] Remove `<ThemeToggle />` import
- [ ] Remove `<ThemeToggle />` from desktop navigation (line 76)
- [ ] Remove `<ThemeToggle />` from mobile menu
- [ ] Verify Settings link is present in both desktop and mobile
- [ ] Add Insights link to navigation
- [ ] Test navigation links work correctly

---

### 4.3 Update Dashboard Components

**File**: `components/dashboard/MonthlyTrendChart.tsx`

- [ ] Remove any `baseCurrency` parameters or props
- [ ] Update to use single currency from settings
- [ ] Verify chart displays correctly

**File**: `components/dashboard/BudgetProgressCard.tsx`

- [ ] Verify currency display uses settings currency
- [ ] Check if any currency filtering needs removal

---

### 4.4 Update Transaction Components

**File**: `components/transactions/TransactionList.tsx`

- [ ] Remove currency column from display if present
- [ ] Ensure all amounts display with settings currency symbol

**File**: `components/transactions/TransactionCard.tsx`

- [ ] Remove currency display if separate from amount
- [ ] Ensure amount formatting uses settings currency

---

### 4.5 Update Savings Components

**File**: `components/savings/SavingsGoalCard.tsx` (if exists)

- [ ] Remove currency selector/field
- [ ] Use settings currency for all amounts
- [ ] Update form submission to not include currency

---

### 4.6 Update Storage Implementation

**File**: `lib/storage/storage.ts`

- [ ] Ensure transaction serialization doesn't include currency field
- [ ] Ensure savings goals serialization doesn't include currency field
- [ ] Add `getSetting()` and `saveSetting()` methods if not present
- [ ] Verify `STORAGE_KEYS.SETTINGS` is correct

---

### 4.7 Update Calculation Helpers

**File**: `lib/calculations/filter-helpers.ts`

- [ ] Ensure no currency filtering functions remain
- [ ] Update exports if needed

**File**: `lib/calculations/monthly-summary.ts`

- [ ] Verify `baseCurrency` parameter is removed from all functions
- [ ] Update any internal references to currency

---

### 4.8 Update Types Exports

**File**: `lib/types/index.ts` (or equivalent)

- [ ] Export `UserSettings` interface
- [ ] Export `PeriodType` type
- [ ] Ensure `CurrencyCode` and `SUPPORTED_CURRENCIES` are exported
- [ ] Verify all transaction types don't include currency

---

## Verification

- [ ] Run `npx tsc --noEmit` - verify no type errors
- [ ] Run `npm run lint` - verify no linting errors
- [ ] Test TransactionForm in browser:
  - [ ] Add new transaction
  - [ ] Edit existing transaction
  - [ ] Verify currency is not shown
  - [ ] Verify amount uses correct currency symbol
- [ ] Test Header in browser:
  - [ ] Verify ThemeToggle is removed
  - [ ] Verify Settings link works
  - [ ] Verify Insights link works
- [ ] Test Dashboard:
  - [ ] Verify all charts display correctly
  - [ ] Verify currency is consistent

---

## Success Criteria

- ✅ TransactionForm has no currency selector
- ✅ All amounts use settings currency
- ✅ Header has no ThemeToggle
- ✅ Settings and Insights links in navigation
- ✅ Dashboard components work without currency parameters
- ✅ Transaction components display amounts correctly
- ✅ Savings components use settings currency
- ✅ Storage doesn't serialize currency fields
- ✅ TypeScript compiles without errors
- ✅ ESLint passes

---

## Dependencies

- **Phase 1**: Type definitions must be updated first
- **Phase 2**: Settings page must exist for currency reference

---

## Estimated Time

2-3 hours
