'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/types'
import storage, { storageEvents } from '@/lib/storage'
import { seedDefaultCategories } from '@/lib/seed-data'
import CategoryModal from '@/components/categories/CategoryModal'
import CategoryList from '@/components/categories/CategoryList'
import DeleteConfirmation from '@/components/categories/DeleteConfirmation'
import {
  canDeleteCategory,
  getAllTransactionCount,
  getAllChildCategoryIds,
  reassignTransactions,
  deleteCategoryWithDependencies,
} from '@/lib/storage/category-helpers'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined
  )
  const [deleteCategory, setDeleteCategory] = useState<Category | undefined>(
    undefined
  )

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    seedDefaultCategories()
    setCategories(storage.getCategories())

    const handleCategoriesChange = () => {
      setCategories(storage.getCategories())
    }

    storageEvents.on('categories', handleCategoriesChange)

    return () => {
      storageEvents.off('categories', handleCategoriesChange)
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAddCategory = () => {
    setEditingCategory(undefined)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategory(category)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCategory(undefined)
  }

  const handleDeleteConfirm = (reassignToId?: string) => {
    if (!deleteCategory) return

    try {
      if (reassignToId) {
        reassignTransactions(deleteCategory.id, reassignToId)
        deleteCategoryWithDependencies(deleteCategory.id)
      } else {
        deleteCategoryWithDependencies(deleteCategory.id)
      }

      setDeleteCategory(undefined)
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const getDeleteCheck = () => {
    if (!deleteCategory) return null

    const deleteCheck = canDeleteCategory(deleteCategory.id)
    const transactionCount = getAllTransactionCount(deleteCategory.id)
    const childIds = getAllChildCategoryIds(deleteCategory.id)

    return {
      hasTransactions: deleteCheck.hasTransactions ?? false,
      transactionCount,
      hasChildCategories: deleteCheck.hasChildCategories ?? false,
      childCategoryCount: childIds.length,
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Categories
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your income and expense categories. Create custom categories
            to better track your finances.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CategoryList
            categories={categories}
            type="income"
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onAdd={handleAddCategory}
          />

          <CategoryList
            categories={categories}
            type="expense"
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onAdd={handleAddCategory}
          />
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          category={editingCategory}
        />
      )}

      {deleteCategory &&
        (() => {
          const check = getDeleteCheck()
          if (!check) return null
          return (
            <DeleteConfirmation
              isOpen={!!deleteCategory}
              onClose={() => setDeleteCategory(undefined)}
              onConfirm={handleDeleteConfirm}
              category={deleteCategory}
              hasTransactions={check.hasTransactions}
              transactionCount={check.transactionCount}
              hasChildCategories={check.hasChildCategories}
              childCategoryCount={check.childCategoryCount}
              otherCategories={categories}
            />
          )
        })()}
    </div>
  )
}
