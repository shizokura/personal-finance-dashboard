'use client'

import { useState } from 'react'
import { Palette } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const PRESET_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#71717a',
  '#000000',
  '#ffffff',
]

const RECENT_COLORS_KEY = 'pfd_recent_colors'

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    const stored = localStorage.getItem(RECENT_COLORS_KEY)
    return stored ? JSON.parse(stored) : []
  })

  const addToRecent = (color: string) => {
    const newRecent = [color, ...recentColors.filter((c) => c !== color)].slice(
      0,
      10
    )
    setRecentColors(newRecent)
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(newRecent))
  }

  const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex)

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Choose color, current color is ${value}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm transition-colors hover:border-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
        >
          <div
            className="h-5 w-5 rounded border border-zinc-200 dark:border-zinc-700"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-zinc-900 dark:text-zinc-50">
            {value}
          </span>
          <Palette className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Choose Color"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Color
            </label>
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                addToRecent(e.target.value)
              }}
              className="h-12 w-full cursor-pointer rounded-lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preset Colors
            </label>
            <div className="grid grid-cols-10 gap-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onChange(color)
                    addToRecent(color)
                  }}
                  aria-label={`Select color ${color}`}
                  className="h-8 w-8 rounded border border-zinc-200 transition-transform hover:scale-110 dark:border-zinc-700"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="hex-input"
              className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Hex Color
            </label>
            <input
              id="hex-input"
              type="text"
              value={value}
              onChange={(e) => {
                const hex = e.target.value
                if (hex.startsWith('#') && hex.length <= 7) {
                  if (isValidHex(hex)) {
                    onChange(hex)
                    addToRecent(hex)
                  }
                }
              }}
              placeholder="#RRGGBB"
              maxLength={7}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-mono shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
            />
          </div>

          {recentColors.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Recent Colors
              </label>
              <div className="grid grid-cols-10 gap-1">
                {recentColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      onChange(color)
                      addToRecent(color)
                    }}
                    aria-label={`Select color ${color}`}
                    className="h-6 w-6 rounded border border-zinc-200 transition-transform hover:scale-110 dark:border-zinc-700"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
            <div
              className="h-10 w-10 rounded-lg"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                Preview
              </p>
              <p
                className="text-xs"
                style={{
                  color: getContrastColor(value),
                }}
              >
                Sample text
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

function getContrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
