'use client'

import { useState } from 'react'
import {
  Database,
  Trash2,
  RefreshCw,
  ChevronDown,
  AlertCircle,
} from 'lucide-react'
import {
  seedDummyTransactionsAsync,
  clearDummyData,
  clearAllTransactions,
} from '@/lib/seed-data'
import storage from '@/lib/storage'

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('')

  const handleSeed10k = async () => {
    setIsLoading(true)
    setError(null)
    setProgress('Generating 10,000 transactions...')
    try {
      await seedDummyTransactionsAsync(10000)
      setProgress('Transactions saved successfully!')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to seed transactions:', error)
      setError('Failed to seed transactions. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeed100 = async () => {
    setIsLoading(true)
    setError(null)
    setProgress('Generating 100 transactions...')
    try {
      await seedDummyTransactionsAsync(100)
      setProgress('Transactions saved successfully!')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to seed transactions:', error)
      setError('Failed to seed transactions. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearDummy = async () => {
    setIsLoading(true)
    setError(null)
    setProgress('Clearing dummy transactions...')
    try {
      clearDummyData()
      setProgress('Dummy data cleared!')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to clear dummy data:', error)
      setError('Failed to clear dummy data. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = async () => {
    setIsLoading(true)
    setError(null)
    setProgress('Clearing all transactions...')
    try {
      clearAllTransactions()
      setProgress('All transactions cleared!')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to clear all transactions:', error)
      setError('Failed to clear transactions. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {isOpen ? (
        <div className="mb-2 w-80 rounded-lg border border-zinc-300 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              <Database className="h-4 w-4" />
              Dev Tools
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleSeed10k}
              disabled={isLoading}
              className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:opacity-50"
            >
              Generate 10k Dummy Transactions
            </button>

            <button
              type="button"
              onClick={handleSeed100}
              disabled={isLoading}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:opacity-50"
            >
              Generate 100 Dummy Transactions
            </button>

            <button
              type="button"
              onClick={handleClearDummy}
              disabled={isLoading}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:opacity-50"
            >
              Clear Dummy Data
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Transactions
            </button>
          </div>

          <div className="mt-3 rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              <strong>Stats:</strong> {storage.getTransactions().length}{' '}
              transactions
            </p>
          </div>

          {isLoading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              {progress}
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-950">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Database className="h-4 w-4" />
          Dev Tools
        </button>
      )}
    </div>
  )
}
