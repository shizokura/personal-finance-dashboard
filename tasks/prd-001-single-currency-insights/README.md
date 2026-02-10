# PRD-001: Single Currency & Insights - Task Breakdown

This directory contains the task breakdown for implementing the Single Currency & Insights features as defined in `prd/PRD-001-single-currency-insights.md`.

---

## Task Phases

| Phase | Name                      | Description                                                  | Estimated Time |
| ----- | ------------------------- | ------------------------------------------------------------ | -------------- |
| 1     | Architecture & Data Model | Remove multi-currency support, update types and calculations | 1-2 hours      |
| 2     | Settings Page             | Create `/settings` with currency, theme, and data management | 3-4 hours      |
| 3     | Insights Page             | Create `/insights` with charts and analytics                 | 4-6 hours      |
| 4     | UI Updates                | Update existing components to remove currency features       | 2-3 hours      |
| 5     | Migration & Storage       | Implement data migration from v1 to v2                       | 2-3 hours      |
| 6     | Testing & Verification    | Comprehensive testing and validation                         | 3-4 hours      |

**Total Estimated Time**: 15-22 hours

---

## Task Files

1. **[phase-1-architecture.md](./phase-1-architecture.md)**
   - Update type definitions (remove currency from Transaction, SavingsGoal)
   - Update calculation functions (remove baseCurrency parameters)
   - Remove currency filtering logic
   - Delete `lib/calculations/filters/by-currency.ts`

2. **[phase-2-settings-page.md](./phase-2-settings-page.md)**
   - Create Settings page (`/settings`)
   - Currency selector component
   - Theme selector component
   - Data management (Export/Import/Clear)
   - Categories management section
   - First-time currency modal

3. **[phase-3-insights-page.md](./phase-3-insights-page.md)**
   - Create Insights page (`/insights`)
   - Period selector (This Week, This Month, This Year, Custom)
   - Spending trends line chart
   - Category breakdown (Pie, Bar, List views)
   - Income vs Expenses comparison
   - Budget health monitoring
   - Alerts & insights

4. **[phase-4-ui-updates.md](./phase-4-ui-updates.md)**
   - Update TransactionForm (remove currency selector)
   - Update Header (remove ThemeToggle, add Insights link)
   - Update dashboard components
   - Update transaction components
   - Update savings components

5. **[phase-5-migration-storage.md](./phase-5-migration-storage.md)**
   - Implement `migrateToV2()` function
   - Update storage schema to version 2
   - Add settings storage methods
   - Add export/import helper functions
   - Add clear data function

6. **[phase-6-testing.md](./phase-6-testing.md)**
   - Type checking and linting
   - Settings page testing
   - Insights page testing
   - Transaction form testing
   - Dashboard testing
   - Migration testing
   - Accessibility testing
   - Responsive testing
   - Dark mode testing
   - Edge cases

---

## Implementation Order

Follow the phases in order (1 → 2 → 3 → 4 → 5 → 6) as each phase depends on the previous ones.

### Quick Start

```bash
# Start with Phase 1
cat tasks/prd-001-single-currency-insights/phase-1-architecture.md

# After completing Phase 1, move to Phase 2
cat tasks/prd-001-single-currency-insights/phase-2-settings-page.md
```

---

## Success Criteria

From the PRD, the overall success criteria are:

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
- ✅ UI is accessible (keyboard navigation, ARIA labels)

---

## Before Committing

After completing all phases:

```bash
npm run format
npm run lint
npx tsc --noEmit
```

Then verify in browser (dev server assumed running):

```bash
npm run dev
```

---

## Tech Stack References

- **Build Commands**: See `AGENTS.md` for available scripts
- **Code Style**: TypeScript, Prettier (no semicolons), ESLint
- **UI Library**: Tailwind CSS v4, Lucide React icons, Recharts for charts
- **Storage**: localStorage with migration support
- **Type Safety**: Strict TypeScript, explicit types, interfaces from `@/lib/types`

---

## Notes

- Always run `npm run format` before committing
- Run `npm run lint` and `npx tsc --noEmit` to verify code quality
- Test in both light and dark modes
- Test on desktop, tablet, and mobile viewports
- Ensure accessibility (keyboard navigation, ARIA labels)
