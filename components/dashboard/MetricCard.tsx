'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'default' | 'green' | 'red'
}

export default function MetricCard({
  label,
  value,
  trend,
  color = 'default',
}: MetricCardProps) {
  const colorClasses = {
    default: 'text-zinc-900 dark:text-zinc-50',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
  }

  const hasValidTrend =
    trend && Number.isFinite(trend.value) && !Number.isNaN(trend.value)

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </h3>
      <div className="mt-2 flex items-baseline gap-2">
        <p className={`text-2xl font-semibold ${colorClasses[color]}`}>
          {value}
        </p>
        {hasValidTrend && (
          <div className="flex items-center gap-1">
            {trend.isPositive ? (
              <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
