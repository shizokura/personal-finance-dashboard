'use client'

import type {
  CategoryBreakdown,
  SubcategoryBreakdown,
  CurrencyCode,
} from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import CardContainer from '@/components/layout/CardContainer'

interface BreakdownListProps {
  title: string
  breakdown: CategoryBreakdown[] | SubcategoryBreakdown[]
  currency: CurrencyCode
  showPercentage?: boolean
}

export default function BreakdownList({
  title,
  breakdown,
  currency,
  showPercentage = true,
}: BreakdownListProps) {
  const maxAmount = breakdown.length > 0 ? breakdown[0].amount : 0

  return (
    <CardContainer title={title}>
      {breakdown.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No data available for this period.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {breakdown.map((item) => {
            const width = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
            return (
              <div
                key={
                  'categoryId' in item ? item.categoryId : item.subcategoryId
                }
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          'color' in item ? item.color : '#6b7280',
                      }}
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {'categoryName' in item
                        ? item.categoryName
                        : item.subcategoryName}
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
                      backgroundColor: 'color' in item ? item.color : '#6b7280',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </CardContainer>
  )
}
