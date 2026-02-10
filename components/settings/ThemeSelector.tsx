'use client'

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import storage from '@/lib/storage'

export default function ThemeSelector() {
  const { setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<
    'light' | 'dark' | 'system'
  >('system')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const settings = storage.getSettings()
    const savedTheme = settings.theme as 'light' | 'dark' | 'system' | undefined
    if (
      savedTheme &&
      ['light', 'dark', 'system'].includes(savedTheme) &&
      savedTheme !== selectedTheme
    ) {
      setSelectedTheme(savedTheme)
    }
  }, [])

  const handleChange = (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme)
    setTheme(theme)
    setHasChanges(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    storage.saveSetting('theme', selectedTheme)
    setHasChanges(false)
    setSaved(true)
    setIsSaving(false)
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Theme
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Choose your preferred color scheme
      </p>

      <div className="mt-4 flex gap-2">
        {themes.map(({ value, label, icon: Icon }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value={value}
              checked={selectedTheme === value}
              onChange={() => handleChange(value)}
              className="sr-only"
            />
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedTheme === value
                  ? 'bg-white shadow-sm dark:bg-zinc-800 dark:border-zinc-600'
                  : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Theme saved successfully
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
