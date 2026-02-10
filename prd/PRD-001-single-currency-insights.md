# Product Requirements Document: Single Currency & Insights

## Overview

Simplify the personal finance dashboard by removing multi-currency support and moving to a single currency model. Introduce new Settings and Insights pages to provide better configuration and analytics capabilities.

## Table of Contents

1. [Architecture Changes](#architecture-changes)
2. [Settings Page](#settings-page)
3. [Insights Page](#insights-page)
4. [Migration Strategy](#migration-strategy)
5. [Data Model Changes](#data-model-changes)

---

## Architecture Changes

### Remove Multi-Currency Support

**Goal**: Simplify the application by removing currency filtering and conversion logic.

#### Changes Required

**Type Updates (`lib/types/common.ts`)**:

- Keep `CurrencyCode` type and `SUPPORTED_CURRENCIES` for currency selection
- These are now only for the initial user currency choice

**Type Updates (`lib/types/transaction.ts`)**:

- Remove `currency: CurrencyCode` from `Transaction` interface
- Remove `currency: CurrencyCode` from `TransactionFormData` interface
- Remove `currency: CurrencyCode` from `SavingsGoal` interface

**Calculation Updates**:

- `lib/calculations/monthly-summary.ts:90` - Remove `baseCurrency` parameter from `calculateMonthlySummary()`
- `lib/calculations/monthly-summary.ts:24-41` - Remove currency filtering in `calculateTotalBalance()`
- `lib/calculations/trend-calculations.ts:5-47` - Remove `baseCurrency` parameter from `calculateMonthlyTrends()`
- Remove `lib/calculations/filters/by-currency.ts` - Delete this file
- Update `lib/calculations/filter-helpers.ts` - Remove `filterTransactionsByTypeAndCurrency()` function
- Update all callers of removed functions

**Transaction Form**:

- Remove currency dropdown/selector from `components/TransactionForm.tsx`
- All amounts are now in the user's selected currency

**Storage**:

- Add new setting: `selectedCurrency` stored in `STORAGE_KEYS.SETTINGS`
- Remove currency from transaction JSON serialization

---

## Settings Page

### Overview

Create `/settings` route for application configuration. All settings are persisted to localStorage.

### Features

#### 1. Currency Selection

**Description**: User selects their primary currency during initial setup or can change it later.

**UI Components**:

- Dropdown/radio group showing all `SUPPORTED_CURRENCIES`
- Display currency code, symbol, and name (e.g., "USD - $ - US Dollar")
- Save button with validation (currency is required)

**Storage**:

- Key: `settings.currency`
- Type: `CurrencyCode`
- Default: `'USD'`

**Behavior**:

- On first visit, show currency selection modal if not set
- When changed, user sees warning about data reset (since they're resetting architecture anyway)
- Updates immediately take effect for new transactions

#### 2. Appearance (Theme)

**Description**: Move theme toggle from navigation to Settings page.

**UI Components**:

- Three options: Light, Dark, System
- Radio buttons with icons (Sun, Moon, Monitor)
- Currently implemented in `components/ThemeToggle.tsx` - reuse this component

**Storage**:

- Key: `settings.theme`
- Type: `'light' | 'dark' | 'system'`
- Default: `'system'`

**Behavior**:

- Reuse existing `ThemeContext` from `contexts/ThemeContext.tsx`
- Remove `<ThemeToggle />` from `components/Header.tsx:76`

#### 3. Data Management

**Description**: Tools for exporting, importing, and clearing data.

**UI Components**:

- **Export Data**: Button to download JSON file of all transactions, categories, accounts, savings goals
- **Import Data**: File input to upload JSON backup
- **Clear All Data**: Destructive button with confirmation modal to reset localStorage

**Export Format**:

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

**Validation**:

- Import validates JSON structure and schema version
- Import merges with existing data or replaces based on user choice
- Clear All requires confirmation: "This will permanently delete all your data. Are you sure?"

#### 4. Categories Management

**Description**: Quick access to categories CRUD operations from Settings.

**UI Components**:

- Link to `/categories` page (already exists)
- Or inline management modal for convenience
- Show category count summary

**Behavior**:

- May defer to existing `/categories` page
- Consider inline management for quick edits

### Navigation Updates

**Update `components/Header.tsx`**:

- Remove `<ThemeToggle />` from desktop nav (line 76)
- Keep Settings link in navigation (already present at lines 69-75)
- Mobile menu also remains unchanged

---

## Insights Page

### Overview

Create `/insights` route for advanced analytics and visualizations. Provide multiple time periods and comprehensive financial insights.

### Features

#### 1. Time Period Selector

**Description**: Allow users to switch between different time periods for insights.

**UI Components**:

- Tab selector: `This Week | This Month | This Year | Custom Range`
- Custom Range: Date picker with start/end dates
- Persists user's last selection

**Storage**:

- Key: `settings.insightsPeriod`
- Type: `'thisWeek' | 'thisMonth' | 'thisYear' | 'custom'`
- Default: `'thisMonth'`

#### 2. Spending Trends

**Description**: Visualize spending patterns over time.

**UI Components**:

- Line chart showing income vs expenses over selected period
- Use `components/dashboard/MonthlyTrendChart.tsx` - extend/modify for insights
- Include previous period comparison (if available)
- Show percentage changes with color indicators (green = positive, red = negative)

**Chart Configuration**:

- X-axis: Time periods (days/weeks/months based on selection)
- Y-axis: Currency amount
- Two lines: Income (green), Expenses (red)
- Tooltip on hover showing exact amounts

**Data**:

- Use `calculateMonthlyTrends()` from `lib/calculations/trend-calculations.ts`
- Adapt for weekly/daily periods as needed

#### 3. Category Breakdown

**Description**: Show which categories consume the budget.

**UI Components**:

- Pie chart or bar chart showing expense distribution by category
- Interactive: Click to filter/drill down into subcategories
- List view showing: Category name, amount, percentage, color-coded bar
- Toggle between Pie, Bar, List views (`ChartViewType` already exists)

**Features**:

- Top categories by amount
- Color-coded by category color
- Click on category to see subcategory breakdown
- Filter transactions by category (link to Transactions page)

**Data**:

- Use `calculateCategoryBreakdown()` from `lib/calculations/breakdown-calculations.ts`

#### 4. Income vs Expenses

**Description**: Compare income and expenses with visual metrics.

**UI Components**:

- Summary cards: Total Income, Total Expenses, Net Savings
- Bar chart showing income vs expenses per period
- Savings rate gauge or progress indicator
- Income sources breakdown (by category)

**Metrics**:

- Total Income for period
- Total Expenses for period
- Net Savings (Income - Expenses)
- Savings Rate (Net Savings / Income × 100)

**Data**:

- Use `calculateMonthlySummary()` for period totals
- Calculate average daily/weekly spending

#### 5. Budget Health

**Description**: Monitor budget progress and alerts.

**UI Components**:

- List of all categories with `budgetLimit` set
- Progress bars showing spent vs budget
- Status indicators: On Track (green), Warning (yellow), Over Budget (red)
- Alerts section: "You're 80% through your Food & Dining budget"
- Budget health score (0-100)

**Status Logic** (from `lib/calculations/budget-calculations.ts`):

- `onTrack`: Spent ≤ 75% of budget
- `warning`: Spent > 75% and ≤ 100% of budget
- `overBudget`: Spent > 100% of budget

**Alerts**:

- Show categories approaching budget (>75%)
- Show categories over budget
- Show positive spending trends (if spending increased significantly vs previous period)

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  Insights                              [This Week ▼]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Income    │  │  Expenses   │  │ Net Savings │    │
│  │  $5,200.00  │  │  $3,450.00  │  │  $1,750.00  │    │
│  │  ▲ 12%      │  │  ▼ 5%       │  │  ▲ 28%      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  Income vs Expenses (Line Chart)                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  $6k │      ╱╲                                    │ │
│  │  $5k │   ╱╱  ╲╲  ╱╲                              │ │
│  │  $4k │  ╱╱    ╲╲╱╱  ╲╲                           │ │
│  │  $3k │ ╱╱      ╲╲     ╲╲                          │ │
│  │  $2k │╱╱        ╲╲      ╲╲                        │ │
│  │     └───────────────────────────────               │ │
│  │      Jan  Feb  Mar  Apr  May  Jun                 │ │
│  │                    Green=Income, Red=Expenses     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Category Breakdown                      [Pie|Bar|List] │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Food & Dining       ████░░░░  $1,200  35%         │ │
│  │ Transportation      ███░░░░░░  $875    25%         │ │
│  │ Housing             ██░░░░░░░  $650    19%         │ │
│  │ Entertainment       █░░░░░░░░  $425    12%         │ │
│  │ Other               ░░░░░░░░░  $300     9%         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Budget Health                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Food & Dining    $1,200 / $1,500  [███████░░] 80% │ │
│  │                 ⚠️ Warning: Approaching budget     │ │
│  │                                                  │ │
│  │ Transportation  $875 / $1,000    [███████░░] 88% │ │
│  │                 ⚠️ Warning: Approaching budget     │ │
│  │                                                  │ │
│  │ Housing         $650 / $800      [██████░░░] 81% │ │
│  │                 ✅ On Track                       │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Alerts & Insights                                      │
│  • Spending on Food & Dining is 15% higher than last  │
│    month                                                │
│  • You saved $1,750 this month - 28% more than last   │
│    month                                                │
│  • Consider setting a budget for Entertainment        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Load Data**:
   - Fetch all transactions from `storage.getTransactions()`
   - Fetch all categories from `storage.getCategories()`
   - Get selected period from settings

2. **Filter Transactions**:
   - Filter by date range based on selected period
   - Filter by status: 'completed' only

3. **Calculate Metrics**:
   - Use `calculateMonthlySummary()` for period totals
   - Use `calculateCategoryBreakdown()` for category analysis
   - Use `calculateBudgetProgress()` for budget health
   - Use `calculateTrendComparison()` for period comparisons

4. **Render Charts**:
   - Use Recharts for visualizations
   - Recharts components already used in dashboard
   - Ensure dark mode compatibility

5. **Handle Empty States**:
   - Show "No transactions for this period" if no data
   - Link to Add Entry page
   - Use `components/ui/EmptyState.tsx`

---

## Migration Strategy

### Version 1 → Version 2 (Single Currency)

### Schema Updates

**File: `lib/storage/schema.ts`**

Add new migration function:

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
  // This is handled by data reset, but we should clean up the structure
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

### Implementation Steps

1. **Update Types**:
   - Remove `currency` fields from Transaction, TransactionFormData, SavingsGoal
   - Update all type exports

2. **Update Calculations**:
   - Remove currency filtering from all calculation functions
   - Remove `baseCurrency` parameters
   - Delete `lib/calculations/filters/by-currency.ts`

3. **Update UI Components**:
   - Remove currency selector from TransactionForm
   - Remove ThemeToggle from Header
   - Create Settings page with currency, theme, and data management
   - Create Insights page with all visualizations

4. **Update Storage**:
   - Add `settings.currency` handling
   - Update schema version to 2
   - Implement migration function

5. **Test**:
   - Test with empty data (new user)
   - Test data export/import
   - Test all insight visualizations
   - Verify currency is correctly applied throughout

---

## Data Model Changes

### Before (Multi-Currency)

```typescript
interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: CurrencyCode // ← REMOVED
  date: Date
  description: string
  categoryId: string
  // ...
}
```

### After (Single Currency)

```typescript
interface Transaction {
  id: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  date: Date
  description: string
  categoryId: string
  // ...
}

// Currency is now a global setting:
interface Settings {
  currency: CurrencyCode
  theme: 'light' | 'dark' | 'system'
  insightsPeriod: 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom'
}
```

### Storage Keys

**File: `lib/storage/keys.ts`** - No changes needed (already has SETTINGS key)

### New Settings Schema

```typescript
interface UserSettings {
  currency: CurrencyCode // User's selected currency
  theme: 'light' | 'dark' | 'system' // Theme preference
  insightsPeriod: PeriodType // Last selected insights period
}

type PeriodType = 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom'
```

---

## Component Structure

### New Components

```
components/settings/
├── CurrencySelector.tsx      # Currency dropdown
├── DataManagement.tsx         # Export/Import/Clear
├── CategoryManagement.tsx    # Quick category access (optional)
└── index.ts

components/insights/
├── InsightsPage.tsx           # Main insights page
├── PeriodSelector.tsx         # Time period tabs
├── SpendingTrends.tsx         # Line chart component
├── CategoryBreakdown.tsx      # Pie/bar/list view
├── IncomeVsExpenses.tsx       # Comparison cards
├── BudgetHealth.tsx           # Budget progress list
└── index.ts
```

### Modified Components

```
components/Header.tsx          # Remove ThemeToggle
components/TransactionForm.tsx # Remove currency selector
```

---

## Success Criteria

### Currency Simplification

- ✅ Currency is selected once in Settings
- ✅ All transactions use the selected currency
- ✅ No currency selection in transaction forms
- ✅ All currency calculations are simplified

### Settings Page

- ✅ User can select currency with clear UI
- ✅ Theme toggle works and persists
- ✅ Data export downloads valid JSON
- ✅ Data import validates and loads correctly
- ✅ Clear all data has confirmation
- ✅ Settings persist across sessions

### Insights Page

- ✅ Time period selector works for all options
- ✅ Spending trends chart displays correctly
- ✅ Category breakdown shows accurate data
- ✅ Income vs Expenses metrics are correct
- ✅ Budget health shows accurate status
- ✅ Empty states display when no data
- ✅ All charts are responsive and accessible
- ✅ Dark mode is supported throughout

### Overall

- ✅ No breaking changes for existing users (migration handles data)
- ✅ TypeScript compiles without errors
- ✅ ESLint passes
- ✅ All tests pass (if added)
- ✅ UI is accessible (keyboard navigation, ARIA labels)

---

## Open Questions

1. **Currency Change Behavior**: Since users are resetting data, should we show a warning or automatically reset data when currency is changed?
   - **Decision**: Show warning, but since they're resetting anyway, just proceed with change

2. **Insights Period Persistence**: Should the last selected period persist?
   - **Decision**: Yes, store in `settings.insightsPeriod`

3. **Category Management in Settings**: Should we show full CRUD or link to categories page?
   - **Decision**: Link to `/categories` page initially, can add inline management later

4. **Budget Health Calculation**: Should we use the existing `calculateBudgetProgress()` or implement new logic?
   - **Decision**: Use existing `calculateBudgetProgress()` from `lib/calculations/budget-calculations.ts`

5. **Chart Library**: Should we continue with Recharts or consider alternatives?
   - **Decision**: Continue with Recharts (already in use, good for our needs)

---

## Future Enhancements (Out of Scope)

- Budget goals with target amounts and deadlines
- Recurring transaction insights
- Spending forecasts and predictions
- Financial health score
- Comparison with previous year
- Export insights to PDF/image
- Custom insight widgets
- Multiple budget periods (weekly, bi-weekly)
- Subscriptions/recurring expenses tracking
