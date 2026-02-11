# Phase 3: Insights Page

## Overview

Create `/insights` route with advanced analytics, charts, and financial insights.

---

## Tasks

### 3.1 Create Insights Page Structure

**Create**: `app/insights/page.tsx`

- [x] Create main Insights page layout
- [x] Add page metadata
- [x] Handle client-side rendering
- [x] Fetch data: transactions, categories, settings
- [x] Handle empty states (link to Add Entry page)

---

### 3.2 Create Period Selector Component

**Create**: `components/insights/PeriodSelector.tsx`

- [x] Tab selector: `This Week | This Month | This Year | Custom Range`
- [x] Custom Range: Date picker with start/end dates
- [x] Persist selection to `settings.insightsPeriod` (default: 'thisMonth')
- [x] Callback to parent when period changes
- [x] Keyboard navigation support

---

### 3.3 Create Spending Trends Component

**Create**: `components/insights/SpendingTrends.tsx`

- [x] Line chart using Recharts (extend from `MonthlyTrendChart.tsx`)
- [x] X-axis: Time periods (days/weeks/months based on selection)
- [x] Y-axis: Currency amount
- [x] Two lines: Income (green), Expenses (red)
- [x] Tooltip on hover showing exact amounts
- [x] Previous period comparison with percentage changes
- [x] Color indicators: green = positive change, red = negative change
- [x] Data source: `calculateMonthlyTrends()` from `lib/calculations/trend-calculations.ts`
- [x] Adapt for weekly/daily periods as needed

---

### 3.4 Create Category Breakdown Component

**Create**: `components/insights/CategoryBreakdown.tsx`

- [x] View toggle: Pie | Bar | List (use existing `ChartViewType`)
- [x] Pie chart: Interactive, click to drill into subcategories
- [x] Bar chart: Horizontal bars showing top categories
- [x] List view: Category name, amount, percentage, color-coded bar
- [x] Top categories by amount
- [x] Color-coded by category color
- [x] Click on category to filter transactions (link to Transactions page)
- [x] Data source: `calculateCategoryBreakdown()` from `lib/calculations/breakdown-calculations.ts`
- [x] Empty state when no categories

---

### 3.5 Create Income vs Expenses Component

**Create**: `components/insights/IncomeVsExpenses.tsx`

- [x] Summary cards: Total Income, Total Expenses, Net Savings
- [x] Each card shows amount and percentage change vs previous period
- [x] Bar chart showing income vs expenses per period
- [x] Savings rate gauge or progress indicator (0-100%)
- [x] Income sources breakdown by category (list)
- [x] Metrics: Total Income, Total Expenses, Net Savings, Savings Rate
- [x] Data source: `calculateMonthlySummary()` for period totals
- [x] Calculate average daily/weekly spending

---

### 3.6 Create Budget Health Component

**Create**: `components/insights/BudgetHealth.tsx`

- [x] List all categories with `budgetLimit` set
- [x] Progress bars showing spent vs budget
- [x] Status indicators with colors:
  - On Track (green): Spent ≤ 75% of budget
  - Warning (yellow): Spent > 75% and ≤ 100% of budget
  - Over Budget (red): Spent > 100% of budget
- [x] Alerts section:
  - "You're 80% through your Food & Dining budget"
  - Show categories approaching budget (>75%)
  - Show categories over budget
  - Show positive spending trends (vs previous period)
- [x] Budget health score (0-100) - optional
- [x] Data source: `calculateBudgetProgress()` from `lib/calculations/budget-calculations.ts`

---

### 3.7 Create Alerts & Insights Component

**Create**: `components/insights/InsightsAlerts.tsx`

- [x] List of insights based on data analysis
- [x] Example alerts:
  - "Spending on Food & Dining is 15% higher than last month"
  - "You saved $1,750 this month - 28% more than last month"
  - "Consider setting a budget for Entertainment"
- [x] Icon indicators for each insight type
- [x] Color-coded: positive (green), negative (red), info (blue)

---

### 3.8 Create Insights Barrel Export

**Create**: `components/insights/index.ts`

- [x] Export all insights components: `PeriodSelector`, `SpendingTrends`, `CategoryBreakdown`, `IncomeVsExpenses`, `BudgetHealth`, `InsightsAlerts`

---

### 3.9 Update Navigation

**File**: `components/Header.tsx`

- [x] Add Insights link to navigation (desktop)
- [x] Add Insights link to mobile menu
- [x] Verify link routes to `/insights`

---

## Page Layout Implementation

**File**: `app/insights/page.tsx`

Layout structure:

```
┌─────────────────────────────────────────────────────────┐
│  Insights                              [This Week ▼]    │
├─────────────────────────────────────────────────────────┤
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
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Alerts & Insights                                      │
│  • Spending on Food & Dining is 15% higher than last  │
│    month                                                │
│  • You saved $1,750 this month - 28% more than last   │
│    month                                                │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow Implementation

1. **Load Data**:
   - [x] Fetch all transactions from `storage.getTransactions()`
   - [x] Fetch all categories from `storage.getCategories()`
   - [x] Get selected period from settings

2. **Filter Transactions**:
   - [x] Filter by date range based on selected period
   - [x] Filter by status: 'completed' only

3. **Calculate Metrics**:
   - [x] Use `calculateMonthlySummary()` for period totals
   - [x] Use `calculateCategoryBreakdown()` for category analysis
   - [x] Use `calculateBudgetProgress()` for budget health
   - [x] Use `calculateTrendComparison()` for period comparisons

4. **Render Charts**:
   - [x] Use Recharts for visualizations
   - [x] Ensure dark mode compatibility

5. **Handle Empty States**:
   - [x] Show "No transactions for this period" if no data
   - [x] Link to Add Entry page
   - [x] Use `components/ui/EmptyState.tsx`

---

## Success Criteria

- ✅ Insights page loads at `/insights`
- ✅ Period selector works for all options (This Week, This Month, This Year, Custom)
- ✅ Spending trends chart displays correctly with income and expenses lines
- ✅ Category breakdown shows accurate data in all views (Pie, Bar, List)
- ✅ Income vs Expenses metrics are correct with percentage changes
- ✅ Budget health shows accurate status (On Track, Warning, Over Budget)
- ✅ Alerts section displays relevant insights
- ✅ Empty states display when no data
- ✅ All charts are responsive and accessible (keyboard navigation)
- ✅ Dark mode is supported throughout
- ✅ Navigation includes Insights link

---

## Dependencies

- **Phase 1**: Type definitions and calculation functions must be updated
- **Phase 2**: Settings page (for `settings.insightsPeriod`)

---

## Estimated Time

4-6 hours
