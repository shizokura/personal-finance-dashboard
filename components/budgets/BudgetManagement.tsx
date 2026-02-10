'use client'

import type { CurrencyCode } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import storage, { storageEvents } from '@/lib/storage'
import { kebabToPascal } from '@/lib/utils/icon-helpers'
import EmptyState from '@/components/ui/EmptyState'
import { useAsyncLoader } from '@/lib/hooks'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

interface BudgetManagementProps {
  currency: CurrencyCode
}

export default function BudgetManagement({ currency }: BudgetManagementProps) {
  const [budgets, setBudgets] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const {
    data: categories,
    isLoading,
    error,
    reload: reloadCategories,
  } = useAsyncLoader({
    loader: () => {
      const cats = storage.getCategories()
      const budgetMap: Record<string, string> = {}
      cats.forEach((cat) => {
        if (cat.budgetLimit) {
          budgetMap[cat.id] = cat.budgetLimit.toString()
        }
      })
      setBudgets(budgetMap)
      return cats
    },
  })

  useEffect(() => {
    const unsubscribe = storageEvents.on('categories', reloadCategories)

    return () => {
      unsubscribe?.()
    }
  }, [reloadCategories])

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgets((prev) => ({
      ...prev,
      [categoryId]: value,
    }))
  }

  const handleSaveBudgets = async () => {
    if (!categories) return

    setIsSaving(true)

    try {
      const updatedCategories = categories.map((cat) => {
        const budgetValue = budgets[cat.id]
        const budgetLimit = budgetValue ? parseFloat(budgetValue) : undefined

        return {
          ...cat,
          budgetLimit:
            budgetLimit !== undefined && budgetLimit > 0
              ? budgetLimit
              : undefined,
          updatedAt: new Date(),
        }
      })

      storage.saveCategories(updatedCategories)
      reloadCategories()
    } catch (error) {
      console.error('Error saving budgets:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const expenseCategories =
    categories?.filter((cat) => cat.type === 'expense') || []

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Category Budgets ({expenseCategories.length})
        </h3>
        <button
          type="button"
          onClick={handleSaveBudgets}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save Budgets'}
        </button>
      </div>

      {isLoading ? (
        <EmptyState variant="loading" message="Loading budgets..." />
      ) : error ? (
        <EmptyState
          variant="error"
          message="Failed to load budgets"
          action={{
            label: 'Retry',
            onClick: reloadCategories,
          }}
        />
      ) : expenseCategories.length === 0 ? (
        <EmptyState variant="empty" message="No expense categories found" />
      ) : (
        <div className="space-y-3">
          {expenseCategories.map((category) => {
            const IconComponent = (
              Icons as unknown as Record<string, React.ComponentType<IconProps>>
            )[kebabToPascal(category.icon || 'circle')]
            const LucideIcon =
              IconComponent || (Icons.Circle as React.ComponentType<IconProps>)

            return (
              <div
                key={category.id}
                className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <LucideIcon
                    className="h-5 w-5"
                    style={{ color: category.color }}
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {category.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {category.budgetLimit
                      ? `Current limit: ${formatCurrency(
                          category.budgetLimit,
                          currency
                        )}`
                      : 'No budget set'}
                  </p>
                </div>

                <div className="flex-1">
                  <label htmlFor={`budget-${category.id}`} className="sr-only">
                    Budget Limit
                  </label>
                  <input
                    id={`budget-${category.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgets[category.id] || ''}
                    onChange={(e) =>
                      handleBudgetChange(category.id, e.target.value)
                    }
                    placeholder="No limit"
                    className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  />
                </div>

                <div className="min-w-[120px] text-right">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {budgets[category.id]
                      ? formatCurrency(
                          parseFloat(budgets[category.id]),
                          currency
                        )
                      : 'No limit'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
