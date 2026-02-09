'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

const RECENT_COLORS_KEY = 'pfd_recent_colors'

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    const stored = localStorage.getItem(RECENT_COLORS_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawColorWheel = (canvas: HTMLCanvasElement): void => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 5

    ctx.clearRect(0, 0, width, height)

    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 2) * Math.PI) / 180
      const endAngle = ((angle + 2) * Math.PI) / 180

      for (let r = 0; r < radius; r += 1) {
        const distance = r / radius
        const hue = angle
        const saturation = distance * 100
        const lightness = 50

        ctx.beginPath()
        ctx.arc(centerX, centerY, r, startAngle, endAngle)
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  useEffect(() => {
    if (canvasRef.current) {
      drawColorWheel(canvasRef.current)
    }
  }, [isOpen])

  const addToRecent = (color: string) => {
    const newRecent = [color, ...recentColors.filter((c) => c !== color)].slice(
      0,
      10
    )
    setRecentColors(newRecent)
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(newRecent))
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = Math.min(canvas.width, canvas.height) / 2 - 5

    if (distance > radius) return

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    const hue = angle < 0 ? angle + 360 : angle
    const saturation = (distance / radius) * 100
    const lightness = 50

    const color = hslToHex(hue, saturation, lightness)
    onChange(color)
    addToRecent(color)
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    }
    const r = Math.round(f(0) * 255)
    const g = Math.round(f(8) * 255)
    const b = Math.round(f(4) * 255)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex)

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    if (hex.startsWith('#') && hex.length <= 7) {
      if (isValidHex(hex)) {
        onChange(hex)
        addToRecent(hex)
      }
    }
  }

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
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
        title="Color Picker"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={200}
              height={200}
              onClick={handleCanvasClick}
              className="cursor-pointer rounded-full border border-zinc-200 dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Hex Color
            </label>
            <input
              type="text"
              value={value}
              onChange={handleHexChange}
              placeholder="#RRGGBB"
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
                    className="h-6 w-6 rounded border border-zinc-200 transition-transform hover:scale-110 dark:border-zinc-700"
                    style={{ backgroundColor: color }}
                    title={color}
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
