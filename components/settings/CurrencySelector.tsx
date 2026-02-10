'use client'

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react'
import storage from '@/lib/storage'
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/types'

export default function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

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

  const handleChange = (code: CurrencyCode) => {
    setSelectedCurrency(code)
    setHasChanges(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    storage.saveSetting('currency', selectedCurrency)
    setHasChanges(false)
    setSaved(true)
    setIsSaving(false)
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Currency
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Select your default currency for transactions and reports
      </p>

      <div className="mt-4">
        <select
          id="currency-select"
          value={selectedCurrency}
          onChange={(e) => handleChange(e.target.value as CurrencyCode)}
          className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
          aria-label="Select currency"
        >
          {Object.values(SUPPORTED_CURRENCIES).map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.symbol} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      {hasChanges && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Changing currency will affect new transactions
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Currency saved successfully
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="ml-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
