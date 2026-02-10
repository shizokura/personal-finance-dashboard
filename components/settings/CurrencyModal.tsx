'use client'

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import storage from '@/lib/storage'
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/types'

interface CurrencyModalProps {
  isOpen: boolean
  onComplete: () => void
}

export default function CurrencyModal({
  isOpen,
  onComplete,
}: CurrencyModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const settings = storage.getSettings()
    const savedCurrency = settings.currency as CurrencyCode | undefined
    if (
      savedCurrency &&
      SUPPORTED_CURRENCIES[savedCurrency] &&
      savedCurrency !== selectedCurrency
    ) {
      setSelectedCurrency(savedCurrency)
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    storage.saveSetting('currency', selectedCurrency)
    setTimeout(() => {
      setIsSaving(false)
      onComplete()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Welcome to Finance Dashboard
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Let&apos;s get started by selecting your preferred currency
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="currency-select"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Select Currency
          </label>
          <select
            id="currency-select"
            value={selectedCurrency}
            onChange={(e) =>
              setSelectedCurrency(e.target.value as CurrencyCode)
            }
            className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-blue-500"
          >
            {Object.values(SUPPORTED_CURRENCIES).map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.symbol} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isSaving ? 'Setting up...' : 'Get Started'}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          You can change this later in Settings
        </p>
      </div>
    </div>
  )
}
