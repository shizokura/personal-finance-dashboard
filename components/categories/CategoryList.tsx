'use client'

import { useState, useMemo } from 'react'
import type { Category, CategoryType } from '@/lib/types'
import CategoryCard from './CategoryCard'
import { ChevronDown, ChevronRight, FolderPlus } from 'lucide-react'

interface CategoryListProps {
  categories: Category[]
  type: CategoryType
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAdd: () => void
}

interface CategoryWithChildren extends Category {
  children: Category[]
}

export default function CategoryList({
  categories,
  type,
  onEdit,
  onDelete,
  onAdd,
}: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const { topCategories, flatList } = useMemo(() => {
    const filtered = categories.filter((cat) => cat.type === type)
    const categoryMap = new Map<string, CategoryWithChildren>()
    const parentIdSet = new Set<string>()

    filtered.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })

    const top: CategoryWithChildren[] = []

    filtered.forEach((cat) => {
      const catWithChildren = categoryMap.get(cat.id)
      if (!catWithChildren) return

      if (cat.parentId) {
        parentIdSet.add(cat.parentId)
        const parent = categoryMap.get(cat.parentId)
        if (parent) {
          parent.children.push(catWithChildren)
        }
      } else {
        top.push(catWithChildren)
      }
    })

    return { topCategories: top, flatList: filtered }
  }, [categories, type])

  const CategoryTreeItem = ({
    category,
    level = 0,
  }: {
    category: CategoryWithChildren
    level?: number
  }) => {
    const hasChildren = category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div
        className={
          level > 0
            ? 'ml-6 mt-2 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700'
            : ''
        }
      >
        <div className="relative">
          {level > 0 && (
            <div className="absolute -left-[21px] top-6 h-6 w-6 border-t-2 border-zinc-200 dark:border-zinc-700" />
          )}
          <div className="flex items-start gap-2">
            {hasChildren && (
              <button
                type="button"
                onClick={() => toggleExpanded(category.id)}
                className="mt-3 rounded-md p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <div
              className={`flex-1 ${hasChildren ? 'flex-1' : 'flex-[calc(100%-20px)]'}`}
            >
              <CategoryCard
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                transactionCount={0}
              />
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {category.children.map((child) => (
              <CategoryTreeItem
                key={child.id}
                category={
                  categoryMap.get(child.id) || { ...child, children: [] }
                }
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryWithChildren>()
    const filtered = categories.filter((cat) => cat.type === type)
    filtered.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] })
    })
    filtered.forEach((cat) => {
      if (cat.parentId) {
        const parent = map.get(cat.parentId)
        if (parent) {
          parent.children.push(map.get(cat.id)!)
        }
      }
    })
    return map
  }, [categories, type])

  if (flatList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-700 dark:bg-zinc-800">
        <FolderPlus className="mb-3 h-12 w-12 text-zinc-400" />
        <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          No {type} categories
        </h3>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Get started by adding your first {type} category
        </p>
        <button
          type="button"
          onClick={onAdd}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 ${
            type === 'income'
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
          }`}
        >
          Add Category
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {type.charAt(0).toUpperCase() + type.slice(1)} Categories
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 ${
            type === 'income'
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
          }`}
        >
          <FolderPlus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-2">
        {topCategories.map((category) => (
          <CategoryTreeItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
