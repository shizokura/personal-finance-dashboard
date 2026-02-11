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
import type { Transaction } from '@/lib/types'
import {
  calculatePeriodTrends,
  getGranularityForPeriod,
} from '@/lib/calculations/trend-calculations'
import {
  filterTransactionsByStatus,
  filterTransactionsByTypes,
} from '@/lib/calculations/filter-helpers'
import { formatCurrency } from '@/lib/utils/format-utils'
import { TREND_COLORS, GRID_STROKE, AXIS_TICK_COLOR } from '@/lib/constants'
import CardContainer from '@/components/layout/CardContainer'
import EmptyState from '@/components/ui/EmptyState'
import type { InsightsPeriodSetting } from './PeriodSelector'
import { getPeriodDateRange } from './PeriodSelector'

function useThemeAwareColors() {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    income: isDark ? TREND_COLORS.dark.income : TREND_COLORS.light.income,
    expenses: isDark ? TREND_COLORS.dark.expenses : TREND_COLORS.light.expenses,
    tick: isDark ? AXIS_TICK_COLOR.dark : AXIS_TICK_COLOR.light,
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  const currency = 'USD' as const
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

interface SpendingTrendsProps {
  transactions: Transaction[]
  period: InsightsPeriodSetting
}

export default function SpendingTrends({
  transactions,
  period,
}: SpendingTrendsProps) {
  const currency = 'USD' as const
  const colors = useThemeAwareColors()

  const dateRange = useMemo(() => getPeriodDateRange(period), [period])

  const granularity = useMemo(
    () => getGranularityForPeriod(period.type),
    [period.type]
  )

  const trendData = useMemo(() => {
    const completedTransactions = filterTransactionsByStatus(
      transactions,
      'completed'
    )
    const validTransactions = filterTransactionsByTypes(completedTransactions, [
      'income',
      'expense',
      'refund',
    ])
    return calculatePeriodTrends(validTransactions, dateRange, granularity)
  }, [transactions, dateRange, granularity])

  const chartData = useMemo(() => {
    return trendData.map((trend) => ({
      period: trend.label,
      income: trend.income,
      expenses: trend.expenses,
    }))
  }, [trendData])

  const previousTrend = trendData[0]
  const currentTrend = trendData[trendData.length - 1]

  const incomeChange = useMemo(() => {
    if (!previousTrend || !currentTrend) return null
    if (previousTrend.income === 0) return null
    const change =
      ((currentTrend.income - previousTrend.income) / previousTrend.income) *
      100
    return change
  }, [previousTrend, currentTrend])

  const expensesChange = useMemo(() => {
    if (!previousTrend || !currentTrend) return null
    if (previousTrend.expenses === 0) return null
    const change =
      ((currentTrend.expenses - previousTrend.expenses) /
        previousTrend.expenses) *
      100
    return change
  }, [previousTrend, currentTrend])

  return (
    <CardContainer>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Spending Trends
        </h3>
        {(incomeChange !== null || expensesChange !== null) && (
          <div className="flex gap-3 text-xs">
            {incomeChange !== null && (
              <span
                className={`flex items-center gap-1 ${incomeChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                Income: {incomeChange >= 0 ? '+' : ''}
                {incomeChange.toFixed(0)}%
              </span>
            )}
            {expensesChange !== null && (
              <span
                className={`flex items-center gap-1 ${expensesChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                Expenses: {expensesChange > 0 ? '+' : ''}
                {expensesChange.toFixed(0)}%
              </span>
            )}
          </div>
        )}
      </div>

      {trendData.length === 0 ? (
        <EmptyState message="No transaction data for this period." />
      ) : (
        <div>
          <p id="spending-trends-chart-desc" className="sr-only">
            {trendData
              .map(
                (t) =>
                  `${t.label}: Income ${formatCurrency(t.income, currency)}, Expenses ${formatCurrency(t.expenses, currency)}`
              )
              .join('; ')}
          </p>
          <div
            role="img"
            aria-label="Spending trends chart showing income and expenses over time"
            aria-describedby="spending-trends-chart-desc"
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
                <Tooltip content={<CustomTooltip />} />
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CardContainer>
  )
}
