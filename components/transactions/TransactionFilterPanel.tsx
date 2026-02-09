'use client'

import { useState } from 'react'
import type {
  TransactionFilter,
  DateRange,
  DateFilter,
  Category,
} from '@/lib/types'
import { getPresetDateRange } from '@/lib/calculations/filter-helpers'
import { Search, X } from 'lucide-react'
import CategoryMultiSelect from './CategoryMultiSelect'
import DateRangeFilter from './DateRangeFilter'

interface TransactionFilterPanelProps {
  filters: TransactionFilter
  onFilterChange: (filters: TransactionFilter) => void
  categories: Category[]
  totalCount: number
  filteredCount: number
}

export default function TransactionFilterPanel({
  filters,
  onFilterChange,
  categories,
  totalCount,
  filteredCount,
}: TransactionFilterPanelProps) {
  const [selectedDatePreset, setSelectedDatePreset] =
    useState<DateFilter>('allTime')

  const hasActiveFilters =
    (filters.searchQuery?.trim() ?? '') !== '' ||
    (filters.categories?.length ?? 0) > 0 ||
    filters.dateRange !== undefined

  const handleClearAll = () => {
    onFilterChange({
      searchQuery: '',
      categories: [],
      dateRange: undefined,
    })
    setSelectedDatePreset('allTime')
  }

  const handleSearchChange = (query: string) => {
    onFilterChange({
      ...filters,
      searchQuery: query,
    })
  }

  const handleCategoryChange = (categoryIds: string[]) => {
    onFilterChange({
      ...filters,
      categories: categoryIds,
    })
  }

  const handleDateFilterChange = (
    dateFilter: DateFilter,
    range?: DateRange
  ) => {
    setSelectedDatePreset(dateFilter)
    onFilterChange({
      ...filters,
      dateRange:
        dateFilter === 'allTime'
          ? undefined
          : range || getPresetDateRange(dateFilter),
    })
  }

  return (
    <div className="mb-6 space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by description or notes..."
              value={filters.searchQuery ?? ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 text-sm shadow-sm transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Categories:
            </span>
            <CategoryMultiSelect
              selectedCategories={filters.categories || []}
              categories={categories}
              onChange={handleCategoryChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Date:
            </span>
            <DateRangeFilter
              dateFilter={selectedDatePreset}
              customDateRange={filters.dateRange}
              onDateFilterChange={handleDateFilterChange}
            />
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredCount} of {totalCount} transaction
          {totalCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
