'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Category } from '@/lib/types'
import CategoryForm from './CategoryForm'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-lg bg-white shadow-lg dark:bg-zinc-900 sm:mx-4">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {category ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <CategoryForm
            category={category}
            onCancel={onClose}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  )
}
