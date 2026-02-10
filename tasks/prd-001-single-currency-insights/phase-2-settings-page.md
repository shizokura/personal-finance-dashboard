# Phase 2: Settings Page

## Overview

Create `/settings` route with currency selection, theme toggle, and data management features.

---

## Tasks

### 2.1 Create Settings Page Structure

**Create**: `app/settings/page.tsx`

- [x] Create main Settings page layout
- [x] Add page metadata and SEO
- [x] Import and use required components
- [x] Handle client-side rendering with `'use client'` directive

---

### 2.2 Create Currency Selector Component

**Create**: `components/settings/CurrencySelector.tsx`

- [x] Dropdown/radio group showing all `SUPPORTED_CURRENCIES`
- [x] Display format: "USD - $ - US Dollar" (code, symbol, name)
- [x] Show currently selected currency from settings
- [x] Add Save button with validation (currency required)
- [x] Add warning when changing currency: "Changing currency will affect new transactions"
- [x] Persist to `settings.currency` (default: 'USD')
- [x] Handle keyboard navigation and accessibility (ARIA labels)

---

### 2.3 Create Theme Selector Component

**Create**: `components/settings/ThemeSelector.tsx`

- [x] Three options: Light, Dark, System
- [x] Radio buttons with icons (Sun, Moon, Monitor from Lucide React)
- [x] Reuse existing `ThemeContext` from `contexts/ThemeContext.tsx`
- [x] Persist to `settings.theme` (default: 'system')
- [x] Handle keyboard navigation

---

### 2.4 Create Data Management Component

**Create**: `components/settings/DataManagement.tsx`

**Export Data**:

- [x] Button to download JSON file of all data
- [x] Export format with version, timestamp, and data:
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
- [x] Use `Blob` and `URL.createObjectURL()` for download

**Import Data**:

- [x] File input to upload JSON backup
- [x] Validate JSON structure and schema version
- [x] Ask user: "Replace existing data" or "Merge with existing data"
- [x] Show error message for invalid files

**Clear All Data**:

- [x] Destructive button with red styling
- [x] Confirmation modal: "This will permanently delete all your data. Are you sure?"
- [x] Clear all localStorage keys
- [x] Redirect to home after clearing

---

### 2.5 Create Categories Management Section

**Create**: `components/settings/CategoryManagement.tsx`

- [x] Link to `/categories` page (existing)
- [x] Show category count summary
- [x] Quick access button "Manage Categories"

---

### 2.6 Create Settings Barrel Export

**Create**: `components/settings/index.ts`

- [x] Export all settings components: `CurrencySelector`, `ThemeSelector`, `DataManagement`, `CategoryManagement`

---

### 2.7 Update Header Component

**File**: `components/Header.tsx`

- [x] Remove `<ThemeToggle />` from desktop navigation (line 76)
- [x] Keep Settings link in navigation (already present)
- [x] Verify mobile menu remains unchanged

---

### 2.8 Add First-Time Currency Selection

**File**: `app/layout.tsx` or create modal component

- [x] Check if `settings.currency` exists on app load
- [x] If not set, show currency selection modal
- [x] Block navigation until currency is selected
- [x] Persist currency to settings on selection

---

## Success Criteria

- ✅ Settings page loads at `/settings`
- ✅ Currency selector shows all supported currencies
- ✅ Theme toggle works and persists across sessions
- ✅ Export data downloads valid JSON with correct structure
- ✅ Import data validates and loads correctly
- ✅ Clear all data requires confirmation and works correctly
- ✅ Categories management links to existing page
- ✅ Header no longer has ThemeToggle
- ✅ First-time users see currency selection modal

---

## Dependencies

- **Phase 1**: Type definitions must be updated first

---

## Estimated Time

3-4 hours
