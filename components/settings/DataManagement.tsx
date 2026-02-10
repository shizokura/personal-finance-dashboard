'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import storage, { migrate } from '@/lib/storage'

interface ExportData {
  version: string
  exportedAt: string
  data: {
    transactions: unknown[]
    categories: unknown[]
    accounts: unknown[]
    savingsGoals: unknown[]
  }
}

export default function DataManagement() {
  const router = useRouter()
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importMode, setImportMode] = useState<'replace' | 'merge' | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data: ExportData = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      data: {
        transactions: storage.getTransactions(),
        categories: storage.getCategories(),
        accounts: storage.getAccounts(),
        savingsGoals: storage.getSavingsGoals(),
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `finance-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/json') {
      setImportFile(file)
      setImportError(null)
      setIsImportModalOpen(true)
    } else {
      setImportError('Please select a valid JSON file')
    }
  }

  const validateImportData = (
    data: unknown
  ): { valid: boolean; error?: string } => {
    if (typeof data !== 'object' || data === null) {
      return { valid: false, error: 'Invalid data format' }
    }

    const parsed = data as { version?: string; data?: unknown }

    if (!parsed.data || typeof parsed.data !== 'object') {
      return { valid: false, error: 'Missing data field' }
    }

    return { valid: true }
  }

  const handleImport = async (mode: 'replace' | 'merge') => {
    if (!importFile) return

    setIsProcessing(true)
    setImportError(null)

    try {
      const text = await importFile.text()
      const json = JSON.parse(text)

      const validation = validateImportData(json)
      if (!validation.valid) {
        setImportError(validation.error || 'Invalid data format')
        setIsProcessing(false)
        return
      }

      const parsedData = json as {
        version?: string
        data: Record<string, unknown>
      }

      if (mode === 'replace') {
        storage.clear()
      }

      if (parsedData.data.transactions) {
        const transactions = parsedData.data.transactions as unknown[]
        transactions.forEach((t) => {
          if (t && typeof t === 'object' && 'id' in t) {
            storage.saveTransaction(t as never)
          }
        })
      }

      if (parsedData.data.categories) {
        const categories = parsedData.data.categories as unknown[]
        categories.forEach((c) => {
          if (c && typeof c === 'object' && 'id' in c) {
            storage.saveCategory(c as never)
          }
        })
      }

      if (parsedData.data.accounts) {
        storage.saveAccounts(parsedData.data.accounts as never)
      }

      if (parsedData.data.savingsGoals) {
        const goals = parsedData.data.savingsGoals as unknown[]
        goals.forEach((g) => {
          if (g && typeof g === 'object' && 'id' in g) {
            storage.saveSavingsGoal(g as never)
          }
        })
      }

      migrate()

      setIsImportModalOpen(false)
      setImportFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      window.location.reload()
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : 'Failed to import data'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearData = () => {
    storage.clear()
    setIsClearModalOpen(false)
    router.push('/')
  }

  return (
    <>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Data Management
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Export, import, or clear all your data
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <button
              type="button"
              onClick={handleExport}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Export Data
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Download a JSON backup of all your data
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Import Data
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Restore from a JSON backup file
                  </p>
                </div>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Import data file"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-left transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/40"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-50">
                    Clear All Data
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete all your transactions, categories, and
                    settings
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Data"
        role="alertdialog"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-50">
                This action cannot be undone
              </p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                All your data including transactions, categories, accounts,
                savings goals, and settings will be permanently deleted.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClearData}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data"
        role="dialog"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          {importError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">
                {importError}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              You are about to import data from:
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {importFile?.name}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
              Choose import mode:
            </p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <input
                  type="radio"
                  name="import-mode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-1 h-4 w-4 border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
                />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Replace existing data
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    All current data will be deleted and replaced with the
                    imported data
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                <input
                  type="radio"
                  name="import-mode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="mt-1 h-4 w-4 border-zinc-300 text-zinc-600 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
                />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Merge with existing data
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Imported data will be combined with your current data
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsImportModalOpen(false)
                setImportFile(null)
                setImportMode(null)
                setImportError(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              disabled={isProcessing}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => importMode && handleImport(importMode)}
              disabled={!importMode || isProcessing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isProcessing ? 'Importing...' : 'Import'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
