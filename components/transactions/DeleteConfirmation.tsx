'use client'

import { AlertTriangle } from 'lucide-react'
import type { Transaction } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils/format-utils'
import Modal from '@/components/ui/Modal'

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  transaction: Transaction
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  transaction,
}: DeleteConfirmationProps) {
  const formattedDate = formatDate(transaction.date)
  const formattedAmount = formatCurrency(transaction.amount, 'USD')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Transaction"
      maxWidth="max-w-md"
      role="alertdialog"
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100">
                Warning: This action cannot be undone
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                Are you sure you want to delete this transaction?
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Description
            </p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {transaction.description}
            </p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Amount</p>
            <p
              className={`text-sm font-medium ${
                transaction.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formattedAmount}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Date</p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel deletion"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:order-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            aria-label="Confirm deletion"
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 sm:order-1"
          >
            <AlertTriangle className="h-4 w-4" />
            Delete Transaction
          </button>
        </div>
      </div>
    </Modal>
  )
}
