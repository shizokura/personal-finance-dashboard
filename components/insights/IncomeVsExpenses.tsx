'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlySummary } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import { TREND_COLORS, GRID_STROKE, AXIS_TICK_COLOR } from '@/lib/constants'
import CardContainer from '@/components/layout/CardContainer'
import MetricCard from '@/components/dashboard/MetricCard'
import EmptyState from '@/components/ui/EmptyState'

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

interface IncomeVsExpensesProps {
  currentMonth: MonthlySummary
  previousMonth?: MonthlySummary
}

export default function IncomeVsExpenses({
  currentMonth,
  previousMonth,
}: IncomeVsExpensesProps) {
  const currency = 'USD' as const
  const colors = useThemeAwareColors()

  const percentageChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return undefined
    return ((current - previous) / previous) * 100
  }

  const incomeTrend = useMemo(() => {
    const change = percentageChange(
      currentMonth.monthlyIncome,
      previousMonth?.monthlyIncome
    )
    if (change === undefined) return undefined
    return { value: change, isPositive: change >= 0 }
  }, [currentMonth.monthlyIncome, previousMonth?.monthlyIncome])

  const expensesTrend = useMemo(() => {
    const change = percentageChange(
      currentMonth.monthlyExpenses,
      previousMonth?.monthlyExpenses
    )
    if (change === undefined) return undefined
    return { value: change, isPositive: change <= 0 }
  }, [currentMonth.monthlyExpenses, previousMonth?.monthlyExpenses])

  const savingsTrend = useMemo(() => {
    const change = percentageChange(
      currentMonth.netSavings,
      previousMonth?.netSavings
    )
    if (change === undefined) return undefined
    return { value: change, isPositive: change >= 0 }
  }, [currentMonth.netSavings, previousMonth?.netSavings])

  const chartData = useMemo(() => {
    const formatPeriod = (month: number, year: number) => {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      return `${monthNames[month - 1]} ${year}`
    }
    const data = [
      {
        period: formatPeriod(
          currentMonth.period.month,
          currentMonth.period.year
        ),
        income: currentMonth.monthlyIncome,
        expenses: currentMonth.monthlyExpenses,
      },
    ]
    if (previousMonth) {
      data.unshift({
        period: formatPeriod(
          previousMonth.period.month,
          previousMonth.period.year
        ),
        income: previousMonth.monthlyIncome,
        expenses: previousMonth.monthlyExpenses,
      })
    }
    return data
  }, [currentMonth, previousMonth])

  const savingsRate = currentMonth.savingsRate ?? 0
  const savingsRateColor =
    savingsRate >= 20 ? 'green' : savingsRate >= 10 ? 'default' : 'red'

  return (
    <CardContainer>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total Income"
          value={formatCurrency(currentMonth.monthlyIncome, currency)}
          trend={incomeTrend}
          color="green"
        />
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(currentMonth.monthlyExpenses, currency)}
          trend={expensesTrend}
          color="red"
        />
        <MetricCard
          label="Net Savings"
          value={formatCurrency(currentMonth.netSavings, currency)}
          trend={savingsTrend}
          color={currentMonth.netSavings >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Savings Rate: {savingsRate.toFixed(1)}%
          </h3>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full transition-all duration-300 ${savingsRateColor === 'green' ? 'bg-green-600 dark:bg-green-400' : savingsRateColor === 'red' ? 'bg-red-600 dark:bg-red-400' : 'bg-zinc-400 dark:bg-zinc-500'}`}
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {savingsRate >= 20
              ? 'Excellent! You are saving more than 20% of your income.'
              : savingsRate >= 10
                ? 'Good progress! Aim to save at least 20% of your income.'
                : 'Consider reducing expenses to increase your savings rate.'}
          </p>
        </div>

        {currentMonth.monthlyIncome === 0 &&
        currentMonth.monthlyExpenses === 0 ? (
          <EmptyState message="No income or expenses for this period yet." />
        ) : (
          <div className="mt-4">
            <p id="income-expenses-chart-desc" className="sr-only">
              Income vs Expenses chart comparing{' '}
              {previousMonth ? '2 periods' : 'current period'}
            </p>
            <div
              role="img"
              aria-label="Income vs Expenses comparison chart"
              aria-describedby="income-expenses-chart-desc"
              className="overflow-x-auto"
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
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
                  <Bar
                    dataKey="income"
                    fill={colors.income}
                    name="Income"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    fill={colors.expenses}
                    name="Expenses"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </CardContainer>
  )
}
