'use client'

import type { SavingsGoal } from '@/lib/types'
import Modal from '@/components/ui/Modal'

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  goal: SavingsGoal
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  goal,
}: DeleteConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Savings Goal">
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-300">
            Are you sure you want to delete the savings goal &ldquo;{goal.name}
            &rdquo;? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete Goal
          </button>
        </div>
      </div>
    </Modal>
  )
}
