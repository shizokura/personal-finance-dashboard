'use client'

import { useState } from 'react'
import type { SavingsGoal } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils/format-utils'
import {
  getProgressColor,
  getStatusColor,
  getStatusText,
} from '@/lib/utils/savings-goal-utils'
import {
  Edit2,
  Trash2,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import SavingsGoalModal from './SavingsGoalModal'
import DeleteConfirmation from './DeleteConfirmation'

interface SavingsGoalsListProps {
  goals: SavingsGoal[]
  onDeleteGoal: (goal: SavingsGoal) => void
}

export default function SavingsGoalsList({
  goals,
  onDeleteGoal,
}: SavingsGoalsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>(
    undefined
  )
  const [deleteGoal, setDeleteGoal] = useState<SavingsGoal | undefined>(
    undefined
  )

  const handleAddGoal = () => {
    setEditingGoal(undefined)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingGoal(undefined)
  }

  const handleDeleteConfirm = () => {
    if (!deleteGoal) return
    onDeleteGoal(deleteGoal)
    setDeleteGoal(undefined)
  }

  if (goals.length === 0) {
    return (
      <>
        <EmptyState
          variant="empty"
          message="No savings goals yet"
          action={{
            label: 'Create Goal',
            onClick: handleAddGoal,
          }}
        />
        <SavingsGoalModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          goal={editingGoal}
        />
      </>
    )
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Savings Goals ({goals.length})
        </h3>
        <button
          type="button"
          onClick={handleAddGoal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                  {goal.name}
                </h4>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(goal.currentAmount, 'USD')} of{' '}
                    {formatCurrency(goal.targetAmount, 'USD')}
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(goal.remaining, 'USD')} remaining
                  </span>
                </div>
                {goal.deadline && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    <span>Target: {formatDate(goal.deadline)}</span>
                    {goal.status === 'overdue' && (
                      <span className="ml-2 inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                        <AlertCircle className="h-3 w-3" />
                        <span>Overdue</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    goal.status
                  )}`}
                >
                  {goal.status === 'completed' && (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  )}
                  {goal.status === 'overdue' && (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {getStatusText(goal.status)}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                <div
                  className={`h-full transition-all duration-300 ${getProgressColor(
                    goal.status
                  )}`}
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>{goal.percentage.toFixed(1)}% achieved</span>
                {goal.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Goal reached!
                  </span>
                ) : goal.status === 'overdue' ? (
                  <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    Past deadline
                  </span>
                ) : (
                  <span>
                    {goal.remaining > 0
                      ? `${Math.ceil(goal.remaining / (goal.targetAmount / 100))}% to go`
                      : 'Almost there!'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingGoal(goal)
                  setIsModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteGoal(goal)
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <SavingsGoalModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        goal={editingGoal}
      />

      {deleteGoal && (
        <DeleteConfirmation
          isOpen={!!deleteGoal}
          onClose={() => setDeleteGoal(undefined)}
          onConfirm={handleDeleteConfirm}
          goal={deleteGoal}
        />
      )}
    </>
  )
}
