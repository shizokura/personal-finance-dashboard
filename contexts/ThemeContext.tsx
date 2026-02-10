'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useState } from 'react'
import storage, { storageEvents } from '@/lib/storage'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const OLD_THEME_KEY = 'pfd-theme'

function migrateOldTheme() {
  try {
    const oldTheme = localStorage.getItem(OLD_THEME_KEY)
    if (oldTheme && ['light', 'dark', 'system'].includes(oldTheme)) {
      storage.saveSetting('theme', oldTheme as Theme)
      localStorage.removeItem(OLD_THEME_KEY)
    }
  } catch (error) {
    console.error('Failed to migrate theme:', error)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    migrateOldTheme()
    const settings = storage.getSettings()
    const storedTheme = settings.theme as Theme | undefined
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setThemeState(storedTheme)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateTheme = () => {
      const effectiveTheme =
        theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme

      setActualTheme(effectiveTheme)

      if (effectiveTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    updateTheme()
    mediaQuery.addEventListener('change', updateTheme)

    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    storage.saveSetting('theme', newTheme)
  }

  useEffect(() => {
    const unsubscribe = storageEvents.on('settings', () => {
      const settings = storage.getSettings()
      const storedTheme = settings.theme as Theme | undefined
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setThemeState(storedTheme)
      }
    })
    return () => unsubscribe?.()
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
