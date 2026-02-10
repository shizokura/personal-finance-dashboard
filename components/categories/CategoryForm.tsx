'use client'

import { useState, useEffect } from 'react'
import type { Category, CategoryType } from '@/lib/types'
import storage from '@/lib/storage'
import ColorPicker from './ColorPicker'
import IconPicker from './IconPicker'

interface CategoryFormProps {
  category?: Category
  onCancel: () => void
  onSuccess: () => void
}

export default function CategoryForm({
  category,
  onCancel,
  onSuccess,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || ('income' as CategoryType),
    icon: category?.icon || '',
    color: category?.color || '#22c55e',
    parentId: category?.parentId || '',
    budgetLimit: category?.budgetLimit?.toString() || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableParents, setAvailableParents] = useState<Category[]>([])

  useEffect(() => {
    const allCategories = storage.getCategories()
    const filtered = allCategories
      .filter((cat) => cat.type === formData.type)
      .filter((cat) => cat.id !== category?.id)
      .filter((cat) => cat.parentId === undefined)
    setAvailableParents(filtered)
  }, [formData.type, category?.id])

  useEffect(() => {
    setFormData({
      name: category?.name || '',
      type: category?.type || ('income' as CategoryType),
      icon: category?.icon || '',
      color: category?.color || '#22c55e',
      parentId: category?.parentId || '',
      budgetLimit: category?.budgetLimit?.toString() || '',
    })
  }, [category])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else {
      const allCategories = storage.getCategories()
      const duplicate = allCategories.find(
        (cat) =>
          cat.name.toLowerCase() === formData.name.toLowerCase() &&
          cat.type === formData.type &&
          cat.id !== category?.id
      )
      if (duplicate) {
        newErrors.name = 'A category with this name already exists'
      }
    }

    if (!formData.icon) {
      newErrors.icon = 'Please select an icon'
    }

    if (!formData.color) {
      newErrors.color = 'Please select a color'
    }

    if (formData.budgetLimit && parseFloat(formData.budgetLimit) <= 0) {
      newErrors.budgetLimit = 'Budget limit must be greater than 0'
    }

    if (formData.parentId) {
      const parent = availableParents.find(
        (cat) => cat.id === formData.parentId
      )
      if (!parent) {
        newErrors.parentId = 'Invalid parent category'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const now = new Date()
      const existingCategories = storage.getCategories()

      if (category) {
        const updatedCategory: Category = {
          ...category,
          name: formData.name.trim(),
          type: formData.type,
          icon: formData.icon,
          color: formData.color,
          parentId: formData.parentId || undefined,
          budgetLimit: formData.budgetLimit
            ? parseFloat(formData.budgetLimit)
            : undefined,
          updatedAt: now,
        }

        const updatedCategories = existingCategories.map((cat) =>
          cat.id === category.id ? updatedCategory : cat
        )

        storage.saveCategories(updatedCategories)
      } else {
        const newCategory: Category = {
          id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name.trim(),
          type: formData.type,
          icon: formData.icon,
          color: formData.color,
          parentId: formData.parentId || undefined,
          budgetLimit: formData.budgetLimit
            ? parseFloat(formData.budgetLimit)
            : undefined,
          createdAt: now,
          updatedAt: now,
        }

        existingCategories.push(newCategory)
        storage.saveCategories(existingCategories)
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving category:', error)
      setErrors({ name: 'Failed to save category' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isIncome = formData.type === 'income'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Category Type
        </label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as CategoryType,
                })
              }
              className="h-4 w-4 border-zinc-300 text-green-600 focus:ring-green-600 dark:border-zinc-600 dark:bg-zinc-800"
              disabled={!!category}
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Income
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as CategoryType,
                })
              }
              className="h-4 w-4 border-zinc-300 text-red-600 focus:ring-red-600 dark:border-zinc-600 dark:bg-zinc-800"
              disabled={!!category}
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Expense
            </span>
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={!!errors.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
          }`}
          placeholder="e.g., Groceries, Salary"
        />
        {errors.name && (
          <p
            id="name-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Icon
          </label>
          <div className="mt-2">
            <IconPicker
              value={formData.icon}
              onChange={(icon) => setFormData({ ...formData, icon })}
              categoryColor={formData.color}
            />
          </div>
          {errors.icon && (
            <p
              id="icon-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.icon}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Color
          </label>
          <div className="mt-2">
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
          </div>
          {errors.color && (
            <p
              id="color-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.color}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="parent"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Parent Category (optional)
        </label>
        <select
          id="parent"
          value={formData.parentId}
          aria-describedby={errors.parentId ? 'parent-error' : undefined}
          aria-invalid={!!errors.parentId}
          onChange={(e) =>
            setFormData({ ...formData, parentId: e.target.value })
          }
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.parentId
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
          }`}
        >
          <option value="">None (top-level category)</option>
          {availableParents.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.parentId && (
          <p
            id="parent-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.parentId}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Budget Limit (optional)
        </label>
        <input
          id="budget"
          type="number"
          step="0.01"
          min="0"
          value={formData.budgetLimit}
          aria-describedby={errors.budgetLimit ? 'budget-error' : undefined}
          aria-invalid={!!errors.budgetLimit}
          onChange={(e) =>
            setFormData({ ...formData, budgetLimit: e.target.value })
          }
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.budgetLimit
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
          }`}
          placeholder="0.00"
        />
        {errors.budgetLimit && (
          <p
            id="budget-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.budgetLimit}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
            isIncome
              ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
          }`}
        >
          {isSubmitting
            ? 'Saving...'
            : category
              ? 'Update Category'
              : 'Create Category'}
        </button>
      </div>
    </form>
  )
}
