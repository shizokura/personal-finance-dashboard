'use client'

import { useState } from 'react'
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
  ResponsiveContainer,
} from 'recharts'
import {
  PieChart as PieIcon,
  BarChart as BarIcon,
  List as ListIcon,
} from 'lucide-react'
import type {
  ChartViewType,
  CategoryBreakdown as CategoryBreakdownType,
  Transaction,
} from '@/lib/types'
import { calculateCategoryBreakdown } from '@/lib/calculations/breakdown-calculations'
import type { Category } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import { GRID_STROKE, AXIS_TICK_COLOR } from '@/lib/constants'
import CardContainer from '@/components/layout/CardContainer'
import EmptyState from '@/components/ui/EmptyState'
import ViewToggle from '@/components/ui/ViewToggle'

function useThemeAwareColors() {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    tick: isDark ? AXIS_TICK_COLOR.dark : AXIS_TICK_COLOR.light,
  }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload?: CategoryBreakdownType
  }>
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  const currency = 'USD' as const
  const payloadArray = payload as
    | Array<{ name: string; value: number; payload?: CategoryBreakdownType }>
    | undefined
  if (active && payloadArray && payloadArray.length > 0) {
    const entry = payloadArray[0]
    const breakdown = entry.payload
    return (
      <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-3 shadow-lg dark:border-zinc-600 dark:bg-zinc-700">
        <p className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {entry.name}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {formatCurrency(entry.value, currency)}
        </p>
        {breakdown && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {breakdown.percentage.toFixed(1)}% • {breakdown.transactionCount}{' '}
            transactions
          </p>
        )}
      </div>
    )
  }
  return null
}

interface CategoryBreakdownProps {
  transactions: Transaction[]
  categories: Category[]
  type: 'income' | 'expense'
  title?: string
}

const viewOptions = [
  { id: 'pie' as ChartViewType, label: 'Pie', icon: PieIcon },
  { id: 'bar' as ChartViewType, label: 'Bar', icon: BarIcon },
  { id: 'list' as ChartViewType, label: 'List', icon: ListIcon },
]

export default function CategoryBreakdown({
  transactions,
  categories,
  type,
  title,
}: CategoryBreakdownProps) {
  const currency = 'USD' as const
  const colors = useThemeAwareColors()
  const [view, setView] = useState<ChartViewType>('pie')

  const breakdown = calculateCategoryBreakdown(transactions, categories, type)

  const chartData = breakdown.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    payload: item,
  }))

  const handleCategoryClick = (categoryId: string) => {
    const url = `/transactions?category=${categoryId}`
    window.location.href = url
  }

  if (breakdown.length === 0) {
    return (
      <CardContainer title={title}>
        <EmptyState message={`No ${type} categories found`} />
      </CardContainer>
    )
  }

  return (
    <CardContainer
      title={
        <div className="flex items-center justify-between">
          {title || `${type === 'income' ? 'Income' : 'Expense'} Breakdown`}
          <ViewToggle value={view} onChange={setView} options={viewOptions} />
        </div>
      }
    >
      <div className="mt-4">
        {view === 'pie' && (
          <div className="overflow-x-auto">
            <p id="pie-chart-desc" className="sr-only">
              Pie chart showing {breakdown.length} categories.{' '}
              {breakdown
                .map(
                  (b) =>
                    `${b.categoryName}: ${formatCurrency(b.amount, currency)} (${b.percentage.toFixed(1)}%)`
                )
                .join('; ')}
            </p>
            <div
              role="img"
              aria-label="Category breakdown pie chart"
              aria-describedby="pie-chart-desc"
              className="overflow-x-auto"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => {
                      const name =
                        entry.payload?.categoryName || entry.name || ''
                      return name.length > 10
                        ? `${name.substring(0, 10)}...`
                        : name
                    }}
                    onClick={(entry) =>
                      entry.payload &&
                      handleCategoryClick(entry.payload.categoryId)
                    }
                    className="cursor-pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.payload?.color || '#6b7280'}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {view === 'bar' && (
          <div className="overflow-x-auto">
            <p id="bar-chart-desc" className="sr-only">
              Bar chart showing {breakdown.length} categories.{' '}
              {breakdown
                .map(
                  (b) =>
                    `${b.categoryName}: ${formatCurrency(b.amount, currency)}`
                )
                .join('; ')}
            </p>
            <div
              role="img"
              aria-label="Category breakdown bar chart"
              aria-describedby="bar-chart-desc"
              className="overflow-x-auto"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className={`${GRID_STROKE.light} dark:${GRID_STROKE.dark}`}
                  />
                  <XAxis
                    type="number"
                    className="text-sm"
                    tick={{ fontSize: 12, fill: colors.tick }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    className="text-sm"
                    tick={{ fontSize: 12, fill: colors.tick }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    radius={[0, 4, 4, 0]}
                    onClick={(entry) =>
                      entry.payload &&
                      handleCategoryClick(entry.payload.categoryId)
                    }
                    className="cursor-pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.payload?.color || '#6b7280'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div
                key={item.categoryId}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                onClick={() => handleCategoryClick(item.categoryId)}
              >
                <div
                  className="h-10 w-1 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {item.categoryName}
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(item.amount, currency)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(item.percentage, 100)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {item.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.transactionCount} transaction
                      {item.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContainer>
  )
}
