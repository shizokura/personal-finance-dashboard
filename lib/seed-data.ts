import type { Category } from '@/lib/types'
import storage from '@/lib/storage'

export const DEFAULT_INCOME_CATEGORIES: Omit<
  Category,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  { name: 'Salary', type: 'income', icon: 'banknote', color: '#22c55e' },
  { name: 'Freelance', type: 'income', icon: 'briefcase', color: '#16a34a' },
  {
    name: 'Investments',
    type: 'income',
    icon: 'trending-up',
    color: '#15803d',
  },
  { name: 'Bonus', type: 'income', icon: 'gift', color: '#166534' },
  { name: 'Dividends', type: 'income', icon: 'percent', color: '#14532d' },
  {
    name: 'Other Income',
    type: 'income',
    icon: 'circle-plus',
    color: '#4ade80',
  },
]

export const DEFAULT_EXPENSE_CATEGORIES: Omit<
  Category,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Food & Dining',
    type: 'expense',
    icon: 'utensils',
    color: '#ef4444',
  },
  { name: 'Housing', type: 'expense', icon: 'home', color: '#dc2626' },
  { name: 'Transportation', type: 'expense', icon: 'car', color: '#b91c1c' },
  { name: 'Utilities', type: 'expense', icon: 'zap', color: '#991b1b' },
  { name: 'Entertainment', type: 'expense', icon: 'film', color: '#7f1d1d' },
  {
    name: 'Healthcare',
    type: 'expense',
    icon: 'heart-pulse',
    color: '#f87171',
  },
  { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#fca5a5' },
  {
    name: 'Education',
    type: 'expense',
    icon: 'graduation-cap',
    color: '#fee2e2',
  },
  {
    name: 'Other Expenses',
    type: 'expense',
    icon: 'circle-minus',
    color: '#fecaca',
  },
]

export function seedDefaultCategories(): void {
  const existingCategories = storage.getCategories()

  if (existingCategories.length === 0) {
    const now = new Date()
    const allDefaults = [
      ...DEFAULT_INCOME_CATEGORIES,
      ...DEFAULT_EXPENSE_CATEGORIES,
    ].map((cat, index) => ({
      ...cat,
      id: `cat_${Date.now()}_${index}`,
      createdAt: now,
      updatedAt: now,
    }))

    storage.saveCategories(allDefaults)
  }
}

export function getDefaultCategories(type: 'income' | 'expense'): Category[] {
  seedDefaultCategories()
  const allCategories = storage.getCategories()
  return allCategories.filter((cat: Category) => cat.type === type)
}
