'use client'

import { useState, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type {
  CategoryBreakdown,
  CurrencyCode,
  ChartViewType,
} from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import CardContainer from '@/components/layout/CardContainer'
import { PieChart as PieChartIcon, BarChart3, List } from 'lucide-react'
import ViewToggle from '@/components/ui/ViewToggle'
import EmptyState from '@/components/ui/EmptyState'
import ExpenseListView from './ExpenseListView'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
  breakdown: CategoryBreakdown[]
  currency: CurrencyCode
}

function CustomTooltip({
  active,
  payload,
  breakdown,
  currency,
}: CustomTooltipProps) {
  const payloadArray = payload as
    | Array<{ name: string; value: number }>
    | undefined
  if (active && payloadArray && payloadArray.length > 0) {
    const data = payloadArray[0]
    const percentage = breakdown.find(
      (item) => item.categoryName === data.name
    )?.percentage

    return (
      <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-3 shadow-lg dark:border-zinc-600 dark:bg-zinc-700">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {data.name}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatCurrency(data.value, currency)}
        </p>
        {percentage != null && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {percentage.toFixed(1)}%
          </p>
        )}
      </div>
    )
  }
  return null
}

interface ExpenseChartProps {
  title: string
  breakdown: CategoryBreakdown[]
  currency: CurrencyCode
}

export default function ExpenseChart({
  title,
  breakdown,
  currency,
}: ExpenseChartProps) {
  const [viewType, setViewType] = useState<ChartViewType>('pie')

  const viewOptions = useMemo(
    () => [
      {
        id: 'pie' as const,
        label: 'Pie',
        icon: PieChartIcon,
      },
      {
        id: 'bar' as const,
        label: 'Bar',
        icon: BarChart3,
      },
      {
        id: 'list' as const,
        label: 'List',
        icon: List,
      },
    ],
    []
  )

  const chartData = useMemo(() => {
    return breakdown.map((item) => ({
      name: item.categoryName,
      value: item.amount,
      fill: item.color,
    }))
  }, [breakdown])

  return (
    <CardContainer
      title={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          <ViewToggle
            value={viewType}
            onChange={setViewType}
            options={viewOptions}
          />
        </div>
      }
    >
      {breakdown.length === 0 ? (
        <EmptyState message="No expense data available for this period." />
      ) : (
        <div className="mt-4">
          <p id="expense-chart-desc" className="sr-only">
            {breakdown
              .map(
                (item) =>
                  `${item.categoryName}: ${formatCurrency(item.amount, currency)} (${item.percentage?.toFixed(1)}%)`
              )
              .join(', ')}
          </p>
          {viewType === 'list' ? (
            <ExpenseListView breakdown={breakdown} currency={currency} />
          ) : viewType === 'pie' ? (
            <div
              role="img"
              aria-label={`Expense breakdown chart showing ${breakdown.length} categories`}
              aria-describedby="expense-chart-desc"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${percent != null ? (percent * 100).toFixed(0) : 0}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <CustomTooltip
                        breakdown={breakdown}
                        currency={currency}
                      />
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div
              role="img"
              aria-label={`Expense breakdown chart showing ${breakdown.length} categories`}
              aria-describedby="expense-chart-desc"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-zinc-200 dark:stroke-zinc-700"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-sm"
                    tick={{ fontSize: 12, fill: '#71717a' }}
                  />
                  <YAxis
                    className="text-sm"
                    tick={{ fontSize: 12, fill: '#71717a' }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        breakdown={breakdown}
                        currency={currency}
                      />
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </CardContainer>
  )
}
