'use client'

import { useEffect } from 'react'
import { AlertTriangle, XCircle, X } from 'lucide-react'
import type { Category } from '@/lib/types'

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reassignToId?: string) => void
  category: Category
  hasTransactions: boolean
  transactionCount: number
  hasChildCategories: boolean
  childCategoryCount: number
  otherCategories: Category[]
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  category,
  hasTransactions,
  transactionCount,
  hasChildCategories,
  childCategoryCount,
  otherCategories,
}: DeleteConfirmationProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const otherCategoriesByType = otherCategories
    .filter((cat) => cat.type === category.type && cat.id !== category.id)
    .filter((cat) => !cat.parentId)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-category-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 sm:mx-4">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="delete-category-title"
            className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Delete Category
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100">
                Warning: This action cannot be undone
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                Are you sure you want to delete &quot;{category.name}&quot;?
              </p>
            </div>
          </div>
        </div>

        {hasTransactions && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  {transactionCount} transaction
                  {transactionCount !== 1 ? 's' : ''} will be affected
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-200">
                  These transactions will become uncategorized or you can
                  reassign them to another category.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasChildCategories && (
          <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
              <div className="flex-1">
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  {childCategoryCount} subcategor
                  {childCategoryCount !== 1 ? 'ies' : 'y'} will also be deleted
                </p>
                <p className="mt-1 text-sm text-orange-700 dark:text-orange-200">
                  All child categories and their transactions will be removed.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasTransactions && otherCategoriesByType.length > 0 && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Reassign transactions to (optional)
            </label>
            <select
              id="reassign"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value === '') {
                  onConfirm()
                } else {
                  onConfirm(e.target.value)
                }
              }}
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
            >
              <option value="">Make transactions uncategorized</option>
              {otherCategoriesByType.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
            onClick={() => onConfirm()}
            aria-label="Confirm deletion"
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 sm:order-1"
          >
            <X className="h-4 w-4" />
            Delete Category
          </button>
        </div>
      </div>
    </div>
  )
}
