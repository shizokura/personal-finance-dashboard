'use client'

import type { MonthlyTrend, TrendComparison, CurrencyCode } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import CardContainer from '@/components/layout/CardContainer'

interface TrendTableProps {
  trends: MonthlyTrend[]
  currency: CurrencyCode
  comparison?: TrendComparison
}

export default function TrendTable({
  trends,
  currency,
  comparison,
}: TrendTableProps) {
  return (
    <CardContainer title="Monthly Trend">
      {trends.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No trend data available yet. Add transactions to see your monthly
          trends.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-3 text-left font-medium text-zinc-900 dark:text-zinc-50">
                  Period
                </th>
                <th className="pb-3 text-right font-medium text-zinc-900 dark:text-zinc-50">
                  Income
                </th>
                <th className="pb-3 text-right font-medium text-zinc-900 dark:text-zinc-50">
                  Expenses
                </th>
                <th className="pb-3 text-right font-medium text-zinc-900 dark:text-zinc-50">
                  Savings
                </th>
                <th className="pb-3 text-right font-medium text-zinc-900 dark:text-zinc-50">
                  Savings Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr
                  key={`${trend.month}-${trend.year}`}
                  className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <td className="py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    {trend.periodLabel}
                  </td>
                  <td className="py-3 text-right text-green-600 dark:text-green-400">
                    {formatCurrency(trend.income, currency)}
                  </td>
                  <td className="py-3 text-right text-red-600 dark:text-red-400">
                    {formatCurrency(trend.expenses, currency)}
                  </td>
                  <td
                    className={`py-3 text-right ${
                      trend.savings >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(trend.savings, currency)}
                  </td>
                  <td className="py-3 text-right text-zinc-900 dark:text-zinc-50">
                    {trend.savingsRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
              {comparison && (
                <tr className="border-b-2 border-zinc-200 dark:border-zinc-700">
                  <td className="py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    Change from {comparison.previous?.periodLabel}
                  </td>
                  <ChangeCell
                    value={comparison.change.income}
                    percentage={comparison.change.incomePercentage}
                    currency={currency}
                    isIncome
                  />
                  <ChangeCell
                    value={comparison.change.expenses}
                    percentage={comparison.change.expensesPercentage}
                    currency={currency}
                  />
                  <ChangeCell
                    value={comparison.change.savings}
                    currency={currency}
                  />
                  <ChangeCell
                    value={comparison.change.savingsRate}
                    isPercentage
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </CardContainer>
  )
}

function ChangeCell({
  value,
  percentage,
  currency,
  isIncome = false,
  isPercentage = false,
}: {
  value: number
  percentage?: number
  currency?: CurrencyCode
  isIncome?: boolean
  isPercentage?: boolean
}) {
  const isPositive = value > 0
  const isZero = value === 0

  let colorClass = ''
  if (isZero) {
    colorClass = 'text-zinc-600 dark:text-zinc-400'
  } else if (isIncome) {
    colorClass = isPositive
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400'
  } else {
    colorClass = isPositive
      ? 'text-red-600 dark:text-red-400'
      : 'text-green-600 dark:text-green-400'
  }

  return (
    <td className={`py-3 text-right ${colorClass}`}>
      <div className="flex items-center justify-end gap-1">
        {isZero ? (
          <Minus className="h-3 w-3" />
        ) : isPositive ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        {isPercentage ? (
          <span>{value.toFixed(1)}%</span>
        ) : (
          <>
            <span>
              {value > 0 ? '+' : ''}
              {formatCurrency(Math.abs(value), currency!)}
            </span>
            {percentage && (
              <span className="text-xs">
                ({percentage > 0 ? '+' : ''}
                {percentage.toFixed(1)}%)
              </span>
            )}
          </>
        )}
      </div>
    </td>
  )
}
