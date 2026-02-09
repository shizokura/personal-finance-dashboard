'use client'

import { useState, useLayoutEffect } from 'react'
import type { DateRange, DateFilter } from '@/lib/types'
import { Calendar, ChevronDown } from 'lucide-react'

interface DateRangeFilterProps {
  dateFilter: DateFilter
  customDateRange?: DateRange
  onDateFilterChange: (filter: DateFilter, range?: DateRange) => void
}

const DATE_PRESETS: { label: string; value: DateFilter }[] = [
  { label: 'All Time', value: 'allTime' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'thisWeek' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'Custom...', value: 'custom' },
]

export default function DateRangeFilter({
  dateFilter,
  customDateRange,
  onDateFilterChange,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState(
    customDateRange?.start?.toISOString().split('T')[0] || ''
  )
  const [tempEndDate, setTempEndDate] = useState(
    customDateRange?.end?.toISOString().split('T')[0] || ''
  )

  const [prevCustomDateRange, setPrevCustomDateRange] =
    useState(customDateRange)

  useLayoutEffect(() => {
    if (
      customDateRange?.start?.getTime() !==
        prevCustomDateRange?.start?.getTime() ||
      customDateRange?.end?.getTime() !== prevCustomDateRange?.end?.getTime()
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempStartDate(
        customDateRange?.start?.toISOString().split('T')[0] || ''
      )
      setTempEndDate(customDateRange?.end?.toISOString().split('T')[0] || '')
      setPrevCustomDateRange(customDateRange)
    }
  }, [customDateRange, prevCustomDateRange])

  const selectedPreset = DATE_PRESETS.find((p) => p.value === dateFilter)
  const displayLabel = selectedPreset?.label || 'Select date range'

  const handlePresetSelect = (filter: DateFilter) => {
    if (filter === 'custom') {
      const today = new Date()
      setTempStartDate(today.toISOString().split('T')[0])
      setTempEndDate(today.toISOString().split('T')[0])
      onDateFilterChange(filter)
    } else {
      setIsOpen(false)
      onDateFilterChange(filter)
    }
  }

  const handleCustomApply = () => {
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate)
      const end = new Date(tempEndDate)
      end.setHours(23, 59, 59, 999)
      setIsOpen(false)
      onDateFilterChange('custom', { start, end })
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm transition-colors hover:border-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
      >
        <Calendar className="h-4 w-4 text-zinc-500" />
        <span className="text-zinc-900 dark:text-zinc-50">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-64 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <div className="max-h-64 overflow-y-auto">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePresetSelect(preset.value)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    dateFilter === preset.value
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {dateFilter === 'custom' && (
              <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
                <div className="space-y-2">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      From
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      To
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCustomApply}
                    disabled={!tempStartDate || !tempEndDate}
                    className="mt-2 w-full rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
