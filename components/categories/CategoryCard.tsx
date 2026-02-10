'use client'

import type { Category } from '@/lib/types'
import * as Icons from 'lucide-react'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { useState, useRef } from 'react'
import { kebabToPascal } from '@/lib/utils/icon-helpers'
import { useEscapeKey } from '@/lib/accessibility'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  transactionCount?: number
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  transactionCount = 0,
}: CategoryCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEscapeKey(() => setShowMenu(false), showMenu)

  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<IconProps>>
  )[kebabToPascal(category.icon || 'circle')]
  const LucideIcon =
    IconComponent || (Icons.Circle as React.ComponentType<IconProps>)

  return (
    <div className="group relative rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <LucideIcon className="h-5 w-5" style={{ color: category.color }} />
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
              {category.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 font-medium"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {category.type}
              </span>
              {transactionCount > 0 && (
                <span>
                  {transactionCount} transaction
                  {transactionCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
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
                aria-label="Category options"
                className="absolute right-0 top-full z-20 mt-1 w-32 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
              >
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    onEdit(category)
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
                    onDelete(category)
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

      {category.budgetLimit && (
        <div className="mt-3 rounded-md bg-zinc-50 p-2 dark:bg-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Budget limit:{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              ${category.budgetLimit.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
