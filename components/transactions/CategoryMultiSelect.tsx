'use client'

import { useState } from 'react'
import type { Category } from '@/lib/types'
import { ChevronDown, Check, Folder } from 'lucide-react'
import { kebabToPascal } from '@/lib/utils/icon-helpers'
import * as Icons from 'lucide-react'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

interface CategoryMultiSelectProps {
  selectedCategories: string[]
  categories: Category[]
  onChange: (selectedIds: string[]) => void
}

export default function CategoryMultiSelect({
  selectedCategories,
  categories,
  onChange,
}: CategoryMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const topLevelCategories = categories.filter((cat) => !cat.parentId)

  const getSubcategories = (categoryId: string): Category[] => {
    return categories.filter((cat) => cat.parentId === categoryId)
  }

  const getAllChildIds = (categoryId: string): string[] => {
    const children = getSubcategories(categoryId)
    let ids: string[] = []

    for (const child of children) {
      ids.push(child.id)
      ids = ids.concat(getAllChildIds(child.id))
    }

    return ids
  }

  const isCategorySelected = (categoryId: string): boolean => {
    return selectedCategories.includes(categoryId)
  }

  const handleToggle = (categoryId: string) => {
    if (isCategorySelected(categoryId)) {
      const childIds = getAllChildIds(categoryId)
      const newSelected = selectedCategories.filter(
        (id) => id !== categoryId && !childIds.includes(id)
      )
      onChange(newSelected)
    } else {
      const childIds = getAllChildIds(categoryId)
      const newSelected = [...selectedCategories, categoryId, ...childIds]
      onChange(newSelected)
    }
  }

  const selectedCount = selectedCategories.length
  const displayLabel =
    selectedCount === 0 ? 'All Categories' : `${selectedCount} selected`

  const getCategoryIcon = (
    category: Category
  ): React.ComponentType<IconProps> => {
    if (category.icon) {
      return (
        (Icons as unknown as Record<string, React.ComponentType<IconProps>>)[
          kebabToPascal(category.icon)
        ] || Folder
      )
    }
    return Folder
  }

  const renderCategoryItem = (category: Category, level = 0) => {
    const isSelected = isCategorySelected(category.id)
    const subcategories = getSubcategories(category.id)
    const CategoryIcon = getCategoryIcon(category)
    const paddingLeft = level * 16

    return (
      <div key={category.id}>
        <button
          type="button"
          onClick={() => handleToggle(category.id)}
          className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
            isSelected
              ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
              : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          <div
            className="flex h-4 w-4 items-center justify-center rounded border"
            style={{
              paddingLeft,
              borderColor: isSelected ? category.color : undefined,
              backgroundColor: isSelected ? category.color : undefined,
            }}
          >
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
          <CategoryIcon className="h-4 w-4" style={{ color: category.color }} />
          <span className="flex-1 text-left">{category.name}</span>
        </button>
        {subcategories.length > 0 &&
          subcategories.map((subcat) => renderCategoryItem(subcat, level + 1))}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm transition-colors hover:border-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
      >
        <Folder className="h-4 w-4 text-zinc-500" />
        <span className="text-zinc-900 dark:text-zinc-50">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 max-h-64 w-64 overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {topLevelCategories.length > 0 ? (
              topLevelCategories.map((category) => renderCategoryItem(category))
            ) : (
              <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                No categories available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
