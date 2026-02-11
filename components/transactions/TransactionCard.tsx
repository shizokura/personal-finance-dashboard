'use client'

import type { Transaction, CurrencyCode } from '@/lib/types'
import { kebabToPascal } from '@/lib/utils/icon-helpers'
import { formatDate, formatCurrency } from '@/lib/utils/format-utils'
import * as Icons from 'lucide-react'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { useState, useRef } from 'react'
import { useEscapeKey } from '@/lib/accessibility'
import storage from '@/lib/storage'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

interface TransactionCardProps {
  transaction: Transaction
  categoryIcon?: string
  categoryName?: string
  categoryColor?: string
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export default function TransactionCard({
  transaction,
  categoryIcon,
  categoryName,
  categoryColor,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [currency] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const settings = storage.getSettings()
      return (settings.currency as CurrencyCode) || 'USD'
    }
    return 'USD'
  })

  useEscapeKey(() => setShowMenu(false), showMenu)

  const isIncome = transaction.type === 'income'
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<IconProps>>
  )[kebabToPascal(categoryIcon || 'circle')]
  const LucideIcon =
    IconComponent || (Icons.Circle as React.ComponentType<IconProps>)

  const formattedDate = formatDate(transaction.date)
  const formattedAmount = formatCurrency(transaction.amount, currency)

  return (
    <div className="group relative rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: categoryColor ? `${categoryColor}20` : '#e5e7eb',
            }}
          >
            <LucideIcon
              className="h-5 w-5"
              style={{ color: categoryColor || '#6b7280' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                {transaction.description}
              </h3>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  isIncome
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{categoryName || 'Uncategorized'}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex flex-col items-end ml-4">
            <p
              className={`text-lg font-semibold ${
                isIncome
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formattedAmount}
            </p>
          </div>
        </div>

        <div className="relative ml-2 flex-shrink-0">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            aria-haspopup="true"
            aria-expanded={showMenu}
            aria-label="More options"
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div
                role="menu"
                aria-label="Transaction options"
                className="absolute right-0 top-full z-20 mt-1 w-32 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    onEdit(transaction)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    onDelete(transaction)
                    setShowMenu(false)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
