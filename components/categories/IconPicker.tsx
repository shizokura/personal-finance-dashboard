'use client'

import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import * as Icons from 'lucide-react'
import { kebabToPascal } from '@/lib/utils/icon-helpers'
import Modal from '@/components/ui/Modal'

interface IconPickerProps {
  value?: string
  onChange: (icon: string) => void
  categoryColor?: string
}

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

const ICON_CATEGORIES = {
  'Money & Finance': [
    'banknote',
    'coins',
    'wallet',
    'credit-card',
    'piggy-bank',
    'landmark',
    'trending-up',
    'trending-down',
    'percent',
    'arrow-up-right',
    'arrow-down-right',
    'chart-line',
    'pie-chart',
  ],
  'Home & Housing': [
    'home',
    'house',
    'building',
    'key',
    'hammer',
    'wrench',
    'paint-bucket',
    'furniture',
    'couch',
    'lamp',
  ],
  'Food & Dining': [
    'utensils',
    'pizza',
    'hamburger',
    'coffee',
    'wine',
    'beer',
    'cake',
    'ice-cream',
    'apple',
    'carrot',
    'shopping-cart',
  ],
  Transportation: [
    'car',
    'truck',
    'bus',
    'train',
    'plane',
    'bicycle',
    'motorcycle',
    'ship',
    'fuel',
    'map-pin',
    'navigation',
  ],
  Entertainment: [
    'film',
    'music',
    'tv',
    'gamepad-2',
    'headphones',
    'mic',
    'camera',
    'ticket',
    'clapperboard',
    'guitar',
    'disc',
  ],
  'Health & Wellness': [
    'heart-pulse',
    'activity',
    'pill',
    'syringe',
    'stethoscope',
    'thermometer',
    'eye',
    'tooth',
    'brain',
    'dumbbell',
    'flask-conical',
  ],
  Shopping: [
    'shopping-bag',
    'shopping-cart',
    'tag',
    'tags',
    'gift',
    'scissors',
    'shirt',
    'footprints',
    'watch',
    'gem',
  ],
  'Work & Career': [
    'briefcase',
    'laptop',
    'monitor',
    'mouse-pointer-2',
    'keyboard',
    'calendar',
    'clock',
    'clipboard-list',
    'file-text',
    'folder',
    'paperclip',
  ],
  Education: [
    'graduation-cap',
    'book',
    'book-open',
    'library',
    'pencil',
    'pen-tool',
    'ruler',
    'calculator',
    'globe',
    'languages',
  ],
  Utilities: [
    'zap',
    'wifi',
    'signal',
    'droplets',
    'flame',
    'thermometer-sun',
    'snowflake',
    'wind',
    'sun',
    'moon',
    'cloud',
  ],
  Personal: [
    'user',
    'users',
    'baby',
    'heart',
    'smile',
    'frown',
    'meh',
    'phone',
    'mail',
    'message-circle',
  ],
  Other: [
    'star',
    'sparkles',
    'circle-plus',
    'circle-minus',
    'settings',
    'help-circle',
    'info',
    'alert-circle',
    'check-circle',
    'x-circle',
  ],
}

export default function IconPicker({
  value,
  onChange,
  categoryColor = '#000000',
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(ICON_CATEGORIES)[0]
  )

  const allIcons = Object.values(ICON_CATEGORIES).flat()

  const filteredIcons = searchQuery
    ? allIcons.filter((icon) =>
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (ICON_CATEGORIES as Record<string, string[]>)[activeCategory] || []

  const LucideIcon =
    (Icons as unknown as Record<string, React.ComponentType<IconProps>>)[
      kebabToPascal(value || 'sparkles')
    ] || Sparkles

  const getIconComponent = (
    iconName: string
  ): React.ComponentType<IconProps> => {
    return (
      (Icons as unknown as Record<string, React.ComponentType<IconProps>>)[
        kebabToPascal(iconName)
      ] || Sparkles
    )
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm transition-colors hover:border-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
        >
          <LucideIcon className="h-5 w-5" style={{ color: categoryColor }} />
          <span className="text-zinc-900 dark:text-zinc-50">
            {value || 'Select Icon'}
          </span>
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Choose Icon"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              aria-label="Search icons"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:focus:border-zinc-500"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1">
            {Object.keys(ICON_CATEGORIES).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map((iconName: string) => {
              const IconComponent = getIconComponent(iconName)
              const isSelected = value === iconName

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName)
                    setIsOpen(false)
                  }}
                  aria-label={`Select icon ${iconName}`}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all ${
                    isSelected
                      ? 'ring-2 ring-zinc-900 dark:ring-zinc-100'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  title={iconName}
                >
                  <IconComponent
                    className="h-5 w-5"
                    style={{
                      color: isSelected ? categoryColor : undefined,
                    }}
                  />
                  <span className="max-w-full truncate text-[10px] text-zinc-600 dark:text-zinc-400">
                    {iconName}
                  </span>
                </button>
              )
            })}
          </div>

          {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500 dark:text-zinc-400">
              <Search className="mb-2 h-8 w-8" />
              <p className="text-sm">No icons found</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
