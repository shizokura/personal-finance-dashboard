'use client'

import { useState, useMemo } from 'react'
import type { DateRange, DateFilter } from '@/lib/types'
import { getPresetDateRange } from '@/lib/calculations/filter-helpers'
import storage from '@/lib/storage'

export type InsightsPeriodType =
  | 'thisWeek'
  | 'thisMonth'
  | 'thisYear'
  | 'custom'

export interface InsightsPeriodSetting {
  type: InsightsPeriodType
  customRange?: DateRange
}

interface PeriodSelectorProps {
  value: InsightsPeriodSetting
  onChange: (period: InsightsPeriodSetting) => void
}

export const PERIOD_OPTIONS: { label: string; value: InsightsPeriodType }[] = [
  { label: 'This Week', value: 'thisWeek' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'This Year', value: 'thisYear' },
  { label: 'Custom Range', value: 'custom' },
]

export function getPeriodDateRange(period: InsightsPeriodSetting): DateRange {
  if (period.type === 'custom' && period.customRange) {
    return period.customRange
  }
  const range = getPresetDateRange(period.type as DateFilter)
  if (range) return range
  return getPresetDateRange('thisMonth')!
}

export function getDefaultPeriod(): InsightsPeriodSetting {
  const settings = storage.getSettings()
  const saved = settings.insightsPeriod as InsightsPeriodSetting | undefined
  if (saved) {
    if (saved.type === 'custom' && saved.customRange) {
      return {
        type: 'custom',
        customRange: {
          start: new Date(saved.customRange.start),
          end: new Date(saved.customRange.end),
        },
      }
    }
    return { type: saved.type }
  }
  return { type: 'thisMonth' }
}

export function savePeriodToSettings(period: InsightsPeriodSetting): void {
  storage.saveSetting('insightsPeriod', period)
}

export default function PeriodSelector({
  value,
  onChange,
}: PeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tempDates = useMemo(() => {
    if (value.type === 'custom' && value.customRange) {
      return {
        startDate: value.customRange.start.toISOString().split('T')[0],
        endDate: value.customRange.end.toISOString().split('T')[0],
      }
    }
    return { startDate: '', endDate: '' }
  }, [value])

  const handlePeriodSelect = (periodType: InsightsPeriodType) => {
    if (periodType === 'custom') {
      const today = new Date()
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      onChange({ type: 'custom', customRange: { start, end } })
    } else {
      setIsOpen(false)
      const newPeriod = { type: periodType as InsightsPeriodType }
      onChange(newPeriod)
      savePeriodToSettings(newPeriod)
    }
  }

  const handleCustomApply = () => {
    if (tempDates.startDate && tempDates.endDate) {
      const start = new Date(tempDates.startDate)
      const end = new Date(tempDates.endDate)
      end.setHours(23, 59, 59, 999)
      const newPeriod = {
        type: 'custom' as InsightsPeriodType,
        customRange: { start, end },
      }
      setIsOpen(false)
      onChange(newPeriod)
      savePeriodToSettings(newPeriod)
    }
  }

  const selectedOption = PERIOD_OPTIONS.find((opt) => opt.value === value.type)
  const displayLabel = selectedOption?.label || 'This Month'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:border-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <svg
          className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute z-20 mt-1 w-56 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            role="listbox"
          >
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value.type === option.value}
                onClick={() => handlePeriodSelect(option.value)}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  value.type === option.value
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                {option.label}
              </button>
            ))}

            {value.type === 'custom' && (
              <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
                <div className="space-y-2">
                  <div>
                    <label
                      htmlFor="insightsStartDate"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      From
                    </label>
                    <input
                      id="insightsStartDate"
                      type="date"
                      value={tempDates.startDate}
                      onChange={(e) =>
                        onChange({
                          type: 'custom',
                          customRange: {
                            start: new Date(e.target.value),
                            end: value.customRange?.end || new Date(),
                          },
                        })
                      }
                      className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="insightsEndDate"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      To
                    </label>
                    <input
                      id="insightsEndDate"
                      type="date"
                      value={tempDates.endDate}
                      onChange={(e) =>
                        onChange({
                          type: 'custom',
                          customRange: {
                            start: value.customRange?.start || new Date(),
                            end: new Date(e.target.value),
                          },
                        })
                      }
                      className="mt-1 block w-full rounded border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCustomApply}
                    disabled={!tempDates.startDate || !tempDates.endDate}
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
