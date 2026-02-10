'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyTrend, CurrencyCode } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import { TREND_COLORS, GRID_STROKE, AXIS_TICK_COLOR } from '@/lib/constants'
import CardContainer from '@/components/layout/CardContainer'
import EmptyState from '@/components/ui/EmptyState'

function useThemeAwareColors() {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    income: isDark ? TREND_COLORS.dark.income : TREND_COLORS.light.income,
    expenses: isDark ? TREND_COLORS.dark.expenses : TREND_COLORS.light.expenses,
    savings: isDark ? TREND_COLORS.dark.savings : TREND_COLORS.light.savings,
    tick: isDark ? AXIS_TICK_COLOR.dark : AXIS_TICK_COLOR.light,
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
  label?: string
  currency: CurrencyCode
}

function CustomTooltip({
  active,
  payload,
  label,
  currency,
}: CustomTooltipProps) {
  const payloadArray = payload as
    | Array<{ name: string; value: number }>
    | undefined
  if (active && payloadArray && payloadArray.length > 0) {
    return (
      <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-3 shadow-lg dark:border-zinc-600 dark:bg-zinc-700">
        <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {label}
        </p>
        {payloadArray.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            className="text-sm text-zinc-600 dark:text-zinc-400"
          >
            {entry.name}: {formatCurrency(entry.value, currency)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface MonthlyTrendChartProps {
  title?: React.ReactNode
  trends: MonthlyTrend[]
  currency: CurrencyCode
}

export default function MonthlyTrendChart({
  title,
  trends,
  currency,
}: MonthlyTrendChartProps) {
  const colors = useThemeAwareColors()

  const chartData = useMemo(() => {
    return trends.map((trend) => ({
      period: trend.periodLabel,
      income: trend.income,
      expenses: trend.expenses,
      savings: trend.savings,
    }))
  }, [trends])

  return (
    <CardContainer title={title}>
      {trends.length === 0 ? (
        <EmptyState message="No trend data available yet. Add transactions to see your monthly trends." />
      ) : (
        <div className="mt-4">
          <p id="trend-chart-desc" className="sr-only">
            {trends
              .map(
                (t) =>
                  `${t.periodLabel}: Income ${formatCurrency(t.income, currency)}, Expenses ${formatCurrency(t.expenses, currency)}, Savings ${formatCurrency(t.savings, currency)}`
              )
              .join('; ')}
          </p>
          <div
            role="img"
            aria-label={`Monthly trend chart showing ${trends.length} periods`}
            aria-describedby="trend-chart-desc"
            className="overflow-x-auto"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className={`${GRID_STROKE.light} dark:${GRID_STROKE.dark}`}
                />
                <XAxis
                  dataKey="period"
                  className="text-sm"
                  tick={{ fontSize: 12, fill: colors.tick }}
                />
                <YAxis
                  className="text-sm"
                  tick={{ fontSize: 12, fill: colors.tick }}
                />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke={colors.income}
                  strokeWidth={2}
                  name="Income"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke={colors.expenses}
                  strokeWidth={2}
                  name="Expenses"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke={colors.savings}
                  strokeWidth={2}
                  name="Savings"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CardContainer>
  )
}
