import type { Metadata } from 'next'
import CurrencySelector from '@/components/settings/CurrencySelector'
import ThemeSelector from '@/components/settings/ThemeSelector'
import DataManagement from '@/components/settings/DataManagement'
import CategoryManagement from '@/components/settings/CategoryManagement'

export const metadata: Metadata = {
  title: 'Settings - Finance Dashboard',
  description: 'Manage your preferences and data settings',
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your preferences, currency, theme, and data
          </p>
        </div>

        <div className="space-y-6">
          <CurrencySelector />
          <ThemeSelector />
          <CategoryManagement />
          <DataManagement />
        </div>
      </div>
    </div>
  )
}
