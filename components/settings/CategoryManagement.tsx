'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderTree } from 'lucide-react'
import storage, { storageEvents } from '@/lib/storage'

export default function CategoryManagement() {
  const [categoryCount, setCategoryCount] = useState({
    categories: 0,
    subcategories: 0,
  })

  useEffect(() => {
    const categories = storage.getCategories()
    const mainCategories = categories.filter((c) => !c.parentId).length
    const subcategories = categories.filter((c) => c.parentId).length
    const newCount = { categories: mainCategories, subcategories }
    setCategoryCount(newCount)

    const unsubscribe = storageEvents.on('categories', () => {
      const updatedCategories = storage.getCategories()
      setCategoryCount({
        categories: updatedCategories.filter((c) => !c.parentId).length,
        subcategories: updatedCategories.filter((c) => c.parentId).length,
      })
    })
    return () => unsubscribe?.()
  }, [])

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <FolderTree className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Categories
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your income and expense categories
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">{categoryCount.categories}</span>{' '}
              categories,{' '}
              <span className="font-medium">{categoryCount.subcategories}</span>{' '}
              subcategories
            </p>
          </div>
        </div>
        <Link
          href="/categories"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  )
}
