'use client'

import { useState } from 'react'
import type { SavingsGoal, CurrencyCode } from '@/lib/types'
import { SUPPORTED_CURRENCIES } from '@/lib/types/common'
import storage from '@/lib/storage'
import { calculateSavingsGoalProgress } from '@/lib/calculations'

interface SavingsGoalFormProps {
  goal?: SavingsGoal
  onCancel: () => void
  onSuccess: () => void
}

export default function SavingsGoalForm({
  goal,
  onCancel,
  onSuccess,
}: SavingsGoalFormProps) {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    targetAmount: goal?.targetAmount?.toString() || '',
    currentAmount: goal?.currentAmount?.toString() || '0',
    deadline: goal?.deadline ? goal.deadline.toISOString().split('T')[0] : '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settingsCurrency] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const settings = storage.getSettings()
      return (settings.currency as CurrencyCode) || 'USD'
    }
    return 'USD'
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required'
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0'
    }

    if (formData.currentAmount && parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative'
    }

    if (
      formData.currentAmount &&
      formData.targetAmount &&
      parseFloat(formData.currentAmount) > parseFloat(formData.targetAmount)
    ) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const now = new Date()
      const targetAmount = parseFloat(formData.targetAmount)
      const currentAmount = parseFloat(formData.currentAmount) || 0
      const deadline = formData.deadline
        ? new Date(formData.deadline)
        : undefined

      if (goal) {
        const updatedGoal: SavingsGoal = {
          ...goal,
          name: formData.name.trim(),
          targetAmount,
          currentAmount,
          deadline,
          updatedAt: now,
        }

        const finalGoal = calculateSavingsGoalProgress(updatedGoal)
        storage.saveSavingsGoal(finalGoal)
        onSuccess()
      } else {
        const newGoal: SavingsGoal = {
          id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          name: formData.name.trim(),
          targetAmount,
          currentAmount,
          percentage: 0,
          remaining: targetAmount - currentAmount,
          status: 'notStarted',
          deadline,
          createdAt: now,
          updatedAt: now,
          processedTransactionIds: [],
        }

        const finalGoal = calculateSavingsGoalProgress(newGoal)
        storage.saveSavingsGoal(finalGoal)
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving savings goal:', error)
      setErrors({ name: 'Failed to save savings goal' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Goal Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
          }`}
          placeholder="e.g., Emergency Fund, Vacation"
        />
        {errors.name && (
          <p
            id="name-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="targetAmount"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Target Amount
        </label>
        <div className="relative mt-2">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded border border-zinc-300 bg-zinc-50 px-2 py-0.5 text-sm font-medium text-zinc-700 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            {SUPPORTED_CURRENCIES[settingsCurrency].symbol}
          </span>
          <input
            id="targetAmount"
            type="number"
            step="0.01"
            min="0"
            value={formData.targetAmount}
            aria-describedby={
              errors.targetAmount ? 'target-amount-error' : undefined
            }
            aria-invalid={!!errors.targetAmount}
            onChange={(e) =>
              setFormData({ ...formData, targetAmount: e.target.value })
            }
            className={`block w-full rounded-lg border px-3 py-2 pl-12 text-sm shadow-sm dark:bg-zinc-800 ${
              errors.targetAmount
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
                : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.targetAmount && (
          <p
            id="target-amount-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.targetAmount}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="currentAmount"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Current Amount (optional)
        </label>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Leave blank to start from 0, or enter an initial amount
        </p>
        <input
          id="currentAmount"
          type="number"
          step="0.01"
          min="0"
          value={formData.currentAmount}
          aria-describedby={
            errors.currentAmount ? 'current-amount-error' : undefined
          }
          aria-invalid={!!errors.currentAmount}
          onChange={(e) =>
            setFormData({ ...formData, currentAmount: e.target.value })
          }
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.currentAmount
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
          }`}
          placeholder="0.00"
        />
        {errors.currentAmount && (
          <p
            id="current-amount-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.currentAmount}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Deadline (optional)
        </label>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Set a target date to achieve this goal
        </p>
        <input
          id="deadline"
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
        </button>
      </div>
    </form>
  )
}
