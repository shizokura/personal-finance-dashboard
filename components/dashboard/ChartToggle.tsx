'use client'

import { PieChart, BarChart3, List } from 'lucide-react'
import type { ChartViewType } from '@/lib/types'

interface ChartToggleProps {
  value: ChartViewType
  onChange: (value: ChartViewType) => void
}

export default function ChartToggle({ value, onChange }: ChartToggleProps) {
  const options: { id: ChartViewType; label: string; icon: React.ReactNode }[] =
    [
      { id: 'pie', label: 'Pie', icon: <PieChart className="h-4 w-4" /> },
      { id: 'bar', label: 'Bar', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'list', label: 'List', icon: <List className="h-4 w-4" /> },
    ]

  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.id
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
          }`}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )
}
