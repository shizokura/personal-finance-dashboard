'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { SavingsGoal, CurrencyCode } from '@/lib/types'
import storage, { storageEvents } from '@/lib/storage'
import BudgetManagement from '@/components/budgets/BudgetManagement'
import SavingsGoalsList from '@/components/savings-goals/SavingsGoalsList'
import { sortGoalsByPriority } from '@/lib/calculations'

export default function BudgetsPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const isValidTab = tabParam === 'budgets' || tabParam === 'savings'
  const [activeTab, setActiveTab] = useState<'budgets' | 'savings'>(
    isValidTab ? tabParam : 'budgets'
  )
  const [baseCurrency] = useState<CurrencyCode>('USD')
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])

  useEffect(() => {
    const loadGoals = () => {
      const goals = storage.getSavingsGoals()
      const sorted = sortGoalsByPriority(goals)
      setSavingsGoals(sorted)
    }

    loadGoals()

    const unsubscribe = storageEvents.on('savingsGoals', loadGoals)

    return () => {
      unsubscribe?.()
    }
  }, [])

  const handleDeleteGoal = (goal: SavingsGoal) => {
    storage.deleteSavingsGoal(goal.id)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Budgets & Goals
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Manage your category budgets and track your savings goals
        </p>
      </div>

      <div>
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('budgets')}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'budgets'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Category Budgets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('savings')}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === 'savings'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Savings Goals
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'budgets' && <BudgetManagement currency={baseCurrency} />}

      {activeTab === 'savings' && (
        <SavingsGoalsList
          goals={savingsGoals}
          onDeleteGoal={handleDeleteGoal}
        />
      )}
    </div>
  )
}
