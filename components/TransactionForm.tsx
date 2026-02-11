'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { TransactionType, Transaction } from '@/lib/types'
import type { CurrencyCode } from '@/lib/types'
import { SUPPORTED_CURRENCIES } from '@/lib/types/common'
import { getDefaultCategories } from '@/lib/seed-data'
import storage from '@/lib/storage'
import type { Category, Metadata } from '@/lib/types'
import { CheckCircle } from 'lucide-react'

interface FormErrors {
  amount?: string
  description?: string
  categoryId?: string
}

interface TransactionFormProps {
  transaction?: Transaction
  onCancel?: () => void
  onSuccess?: () => void
}

export default function TransactionForm({
  transaction,
  onCancel,
  onSuccess,
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    transaction?.type ?? 'income'
  )
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? '')
  const [date, setDate] = useState(
    transaction?.date.toISOString().split('T')[0] ??
      new Date().toISOString().split('T')[0]
  )
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '')
  const [notes, setNotes] = useState(transaction?.metadata?.notes ?? '')
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [settingsCurrency] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const settings = storage.getSettings()
      return (settings.currency as CurrencyCode) || 'USD'
    }
    return 'USD'
  })
  const isEditMode = !!transaction

  useEffect(() => {
    const categoryType: 'income' | 'expense' =
      transactionType === 'income' ? 'income' : 'expense'
    const cats = getDefaultCategories(categoryType)
    setCategories(cats)
    if (!transaction && !categoryId) {
      setCategoryId(cats[0]?.id || '')
    }
  }, [transactionType, transaction, categoryId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!categoryId) {
      newErrors.categoryId = 'Please select a category'
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
    setSuccessMessage('')

    try {
      const now = new Date()
      const transactionDate = new Date(date)

      const metadata: Metadata = {}
      if (notes.trim()) {
        metadata.notes = notes.trim()
      }

      if (isEditMode && transaction) {
        const updatedTransaction: Transaction = {
          ...transaction,
          type: transactionType,
          amount: parseFloat(amount),
          date: transactionDate,
          description: description.trim(),
          categoryId,
          metadata,
          updatedAt: now,
        }

        storage.saveTransaction(updatedTransaction)
        onSuccess?.()
      } else {
        const newTransaction: Transaction = {
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: transactionType,
          status: 'completed',
          amount: parseFloat(amount),
          date: transactionDate,
          description: description.trim(),
          categoryId,
          attachments: [],
          metadata,
          createdAt: now,
          updatedAt: now,
        }

        storage.saveTransaction(newTransaction)

        setSuccessMessage(
          `${transactionType === 'income' ? 'Income' : 'Expense'} saved successfully!`
        )

        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)

        setAmount('')
        setDescription('')
        setNotes('')
        setDate(new Date().toISOString().split('T')[0])

        const categoryType: 'income' | 'expense' =
          transactionType === 'income' ? 'income' : 'expense'
        const defaultCat = getDefaultCategories(categoryType)[0]
        setCategoryId(defaultCat?.id || '')
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      setErrors({ description: 'Failed to save transaction' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isIncome = transactionType === 'income'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div
          role="status"
          className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Transaction Type
        </label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="income"
              checked={transactionType === 'income'}
              onChange={() => setTransactionType('income')}
              className="h-4 w-4 border-zinc-300 text-green-600 focus:ring-green-600 dark:border-zinc-600 dark:bg-zinc-800"
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
              checked={transactionType === 'expense'}
              onChange={() => setTransactionType('expense')}
              className="h-4 w-4 border-zinc-300 text-red-600 focus:ring-red-600 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Expense
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Amount
          </label>
          <div className="relative mt-2">
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              aria-invalid={!!errors.amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
                errors.amount
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
                  : `border-zinc-300 focus:border-${isIncome ? 'green' : 'red'}-600 focus:ring-${isIncome ? 'green' : 'red'}-600 dark:border-zinc-600 dark:focus:border-${isIncome ? 'green' : 'red'}-500`
              }`}
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {SUPPORTED_CURRENCIES[settingsCurrency].symbol}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Amount in {SUPPORTED_CURRENCIES[settingsCurrency].name}
          </p>
          {errors.amount && (
            <p
              id="amount-error"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.amount}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          aria-describedby={
            errors.description ? 'description-error' : undefined
          }
          aria-invalid={!!errors.description}
          onChange={(e) => setDescription(e.target.value)}
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500'
          }`}
          placeholder="e.g., Monthly salary, Grocery shopping"
        />
        {errors.description && (
          <p
            id="description-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          aria-describedby={errors.categoryId ? 'category-error' : undefined}
          aria-invalid={!!errors.categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm dark:bg-zinc-800 ${
            errors.categoryId
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-500'
              : `border-zinc-300 focus:border-${isIncome ? 'green' : 'red'}-600 focus:ring-${isIncome ? 'green' : 'red'}-600 dark:border-zinc-600 dark:focus:border-${isIncome ? 'green' : 'red'}-500`
          }`}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p
            id="category-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.categoryId}
          </p>
        )}
        <Link
          href="/categories"
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Create new category
        </Link>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
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
            : isEditMode
              ? 'Update Transaction'
              : `Save ${isIncome ? 'Income' : 'Expense'}`}
        </button>
      </div>
    </form>
  )
}
