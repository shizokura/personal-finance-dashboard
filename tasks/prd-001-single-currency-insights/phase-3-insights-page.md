# Phase 3: Insights Page

## Overview

Create `/insights` route with advanced analytics, charts, and financial insights.

---

## Tasks

### 3.1 Create Insights Page Structure

**Create**: `app/insights/page.tsx`

- [ ] Create main Insights page layout
- [ ] Add page metadata
- [ ] Handle client-side rendering
- [ ] Fetch data: transactions, categories, settings
- [ ] Handle empty states (link to Add Entry page)

---

### 3.2 Create Period Selector Component

**Create**: `components/insights/PeriodSelector.tsx`

- [ ] Tab selector: `This Week | This Month | This Year | Custom Range`
- [ ] Custom Range: Date picker with start/end dates
- [ ] Persist selection to `settings.insightsPeriod` (default: 'thisMonth')
- [ ] Callback to parent when period changes
- [ ] Keyboard navigation support

---

### 3.3 Create Spending Trends Component

**Create**: `components/insights/SpendingTrends.tsx`

- [ ] Line chart using Recharts (extend from `MonthlyTrendChart.tsx`)
- [ ] X-axis: Time periods (days/weeks/months based on selection)
- [ ] Y-axis: Currency amount
- [ ] Two lines: Income (green), Expenses (red)
- [ ] Tooltip on hover showing exact amounts
- [ ] Previous period comparison with percentage changes
- [ ] Color indicators: green = positive change, red = negative change
- [ ] Data source: `calculateMonthlyTrends()` from `lib/calculations/trend-calculations.ts`
- [ ] Adapt for weekly/daily periods as needed

---

### 3.4 Create Category Breakdown Component

**Create**: `components/insights/CategoryBreakdown.tsx`

- [ ] View toggle: Pie | Bar | List (use existing `ChartViewType`)
- [ ] Pie chart: Interactive, click to drill into subcategories
- [ ] Bar chart: Horizontal bars showing top categories
- [ ] List view: Category name, amount, percentage, color-coded bar
- [ ] Top categories by amount
- [ ] Color-coded by category color
- [ ] Click on category to filter transactions (link to Transactions page)
- [ ] Data source: `calculateCategoryBreakdown()` from `lib/calculations/breakdown-calculations.ts`
- [ ] Empty state when no categories

---

### 3.5 Create Income vs Expenses Component

**Create**: `components/insights/IncomeVsExpenses.tsx`

- [ ] Summary cards: Total Income, Total Expenses, Net Savings
- [ ] Each card shows amount and percentage change vs previous period
- [ ] Bar chart showing income vs expenses per period
- [ ] Savings rate gauge or progress indicator (0-100%)
- [ ] Income sources breakdown by category (list)
- [ ] Metrics: Total Income, Total Expenses, Net Savings, Savings Rate
- [ ] Data source: `calculateMonthlySummary()` for period totals
- [ ] Calculate average daily/weekly spending

---

### 3.6 Create Budget Health Component

**Create**: `components/insights/BudgetHealth.tsx`

- [ ] List all categories with `budgetLimit` set
- [ ] Progress bars showing spent vs budget
- [ ] Status indicators with colors:
  - On Track (green): Spent ≤ 75% of budget
  - Warning (yellow): Spent > 75% and ≤ 100% of budget
  - Over Budget (red): Spent > 100% of budget
- [ ] Alerts section:
  - "You're 80% through your Food & Dining budget"
  - Show categories approaching budget (>75%)
  - Show categories over budget
  - Show positive spending trends (vs previous period)
- [ ] Budget health score (0-100) - optional
- [ ] Data source: `calculateBudgetProgress()` from `lib/calculations/budget-calculations.ts`

---

### 3.7 Create Alerts & Insights Component

**Create**: `components/insights/InsightsAlerts.tsx`

- [ ] List of insights based on data analysis
- [ ] Example alerts:
  - "Spending on Food & Dining is 15% higher than last month"
  - "You saved $1,750 this month - 28% more than last month"
  - "Consider setting a budget for Entertainment"
- [ ] Icon indicators for each insight type
- [ ] Color-coded: positive (green), negative (red), info (blue)

---

### 3.8 Create Insights Barrel Export

**Create**: `components/insights/index.ts`

- [ ] Export all insights components: `PeriodSelector`, `SpendingTrends`, `CategoryBreakdown`, `IncomeVsExpenses`, `BudgetHealth`, `InsightsAlerts`

---

### 3.9 Update Navigation

**File**: `components/Header.tsx`

- [ ] Add Insights link to navigation (desktop)
- [ ] Add Insights link to mobile menu
- [ ] Verify link routes to `/insights`

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
   - [ ] Fetch all transactions from `storage.getTransactions()`
   - [ ] Fetch all categories from `storage.getCategories()`
   - [ ] Get selected period from settings

2. **Filter Transactions**:
   - [ ] Filter by date range based on selected period
   - [ ] Filter by status: 'completed' only

3. **Calculate Metrics**:
   - [ ] Use `calculateMonthlySummary()` for period totals
   - [ ] Use `calculateCategoryBreakdown()` for category analysis
   - [ ] Use `calculateBudgetProgress()` for budget health
   - [ ] Use `calculateTrendComparison()` for period comparisons

4. **Render Charts**:
   - [ ] Use Recharts for visualizations
   - [ ] Ensure dark mode compatibility

5. **Handle Empty States**:
   - [ ] Show "No transactions for this period" if no data
   - [ ] Link to Add Entry page
   - [ ] Use `components/ui/EmptyState.tsx`

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
