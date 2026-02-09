'use client'

import type { CategoryBreakdown, CurrencyCode } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'

interface ExpenseListViewProps {
  breakdown: CategoryBreakdown[]
  currency: CurrencyCode
  showPercentage?: boolean
}

export default function ExpenseListView({
  breakdown,
  currency,
  showPercentage = true,
}: ExpenseListViewProps) {
  const maxAmount = breakdown.length > 0 ? breakdown[0].amount : 0

  return (
    <div className="space-y-4">
      {breakdown.map((item) => {
        const width = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
        return (
          <div key={item.categoryId}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {item.categoryName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {showPercentage && (
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.percentage.toFixed(1)}%
                  </span>
                )}
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {formatCurrency(item.amount, currency)}
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${width}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
