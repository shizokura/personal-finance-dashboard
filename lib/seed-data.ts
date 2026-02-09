import type {
  Category,
  CurrencyCode,
  Transaction,
  TransactionStatus,
  TransactionType,
  RecurringFrequency,
  RecurringTransaction,
} from '@/lib/types'
import { SUPPORTED_CURRENCIES } from '@/lib/types'
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

const DUMMY_ACCOUNTS = [
  'Checking',
  'Savings',
  'Credit Card',
  'Investment',
  'Cash',
]

const DUMMY_TAGS = [
  'work',
  'personal',
  'groceries',
  'utilities',
  'dining',
  'vacation',
  'health',
  'education',
  'entertainment',
  'shopping',
  'transport',
  'home',
  'family',
  'gifts',
  'subscriptions',
  'fitness',
  'hobbies',
  'pets',
  'charity',
  'business',
]

const RECURRING_FREQUENCIES: RecurringFrequency[] = [
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
  'yearly',
]

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function getRandomDate(rangeMonths: number): Date {
  const now = new Date()
  const monthsAgo = getRandomInt(0, rangeMonths)
  const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()
  date.setDate(getRandomInt(1, daysInMonth))
  return date
}

function getRandomCurrency(): CurrencyCode {
  const codes = Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]
  return getRandomItem(codes)
}

function getRandomTransactionType(): TransactionType {
  const rand = Math.random()
  if (rand < 0.6) return 'expense'
  if (rand < 0.8) return 'income'
  if (rand < 0.9) return 'transfer'
  if (rand < 0.95) return 'refund'
  return 'recurring'
}

function getRandomCategory(type: 'income' | 'expense'): Category {
  const categories = getDefaultCategories(type)
  return getRandomItem(categories)
}

function getRandomAmount(min: number, max: number): number {
  const power = Math.random()
  const range = max - min
  const scaled = Math.pow(power, 2) * range
  const amount = min + scaled
  return Math.round(amount * 100) / 100
}

function getRandomTags(): string[] {
  if (Math.random() > 0.3) return []
  const count = getRandomInt(1, 3)
  const shuffled = [...DUMMY_TAGS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getRandomStatus(): TransactionStatus {
  const rand = Math.random()
  if (rand < 0.9) return 'completed'
  if (rand < 0.95) return 'pending'
  if (rand < 0.98) return 'cancelled'
  return 'failed'
}

function getRandomAccount(): string {
  return getRandomItem(DUMMY_ACCOUNTS)
}

function getRecurringFrequency(): RecurringFrequency {
  return getRandomItem(RECURRING_FREQUENCIES)
}

function getRandomDescription(
  type: TransactionType,
  category: Category
): string {
  const descriptions: Record<TransactionType, Record<string, string[]>> = {
    income: {
      Salary: ['Monthly Salary', 'Biweekly Paycheck', 'Direct Deposit'],
      Freelance: ['Project Payment', 'Consulting Fee', 'Contract Work'],
      Investments: ['Stock Dividend', 'Bond Interest', 'Capital Gains'],
      Bonus: ['Performance Bonus', 'Holiday Bonus', 'Signing Bonus'],
      Dividends: ['Quarterly Dividend', 'Special Dividend', 'Stock Dividend'],
      'Other Income': ['Cash Gift', 'Refund', 'Miscellaneous Income'],
    },
    expense: {
      'Food & Dining': [
        'Grocery Store',
        'Restaurant Dinner',
        'Coffee Shop',
        'Fast Food',
        'Lunch Out',
      ],
      Housing: [
        'Rent Payment',
        'Mortgage',
        'Home Insurance',
        'Home Maintenance',
      ],
      Transportation: [
        'Gas Station',
        'Uber Ride',
        'Car Repair',
        'Parking Fee',
        'Public Transit',
      ],
      Utilities: [
        'Electric Bill',
        'Water Bill',
        'Internet Service',
        'Gas Bill',
        'Phone Bill',
      ],
      Entertainment: [
        'Movie Theater',
        'Streaming Service',
        'Concert Tickets',
        'Video Games',
        'Spotify',
      ],
      Healthcare: [
        'Doctor Visit',
        'Pharmacy',
        'Dental Checkup',
        'Health Insurance',
        'Eyeglasses',
      ],
      Shopping: [
        'Amazon Purchase',
        'Clothing Store',
        'Electronics',
        'Online Shopping',
        'Department Store',
      ],
      Education: [
        'Tuition Payment',
        'Textbooks',
        'Online Course',
        'School Supplies',
        'Training',
      ],
      'Other Expenses': ['Miscellaneous', 'Emergency Fund', 'Unexpected Cost'],
    },
    transfer: {
      Salary: ['Transfer to Savings'],
      Freelance: ['Transfer to Investment'],
      Investments: ['Transfer to Checking'],
      Bonus: ['Transfer to Credit Card'],
      Dividends: ['Transfer to Checking'],
      'Other Income': ['Transfer to Cash'],
    },
    refund: {
      'Food & Dining': ['Refund: Restaurant Delivery', 'Refund: Food Order'],
      Shopping: [
        'Refund: Amazon Return',
        'Refund: Online Purchase',
        'Refund: Store Return',
      ],
      Entertainment: ['Refund: Movie Tickets', 'Refund: Event Tickets'],
      'Other Expenses': ['Refund: Service Charge', 'Refund: Fee'],
    },
    recurring: {
      Housing: ['Monthly Rent', 'HOA Fee', 'Property Tax'],
      Utilities: ['Netflix Subscription', 'Internet Bill', 'Phone Plan'],
      Entertainment: ['Spotify Premium', 'YouTube Premium', 'Gym Membership'],
      Shopping: ['Amazon Prime', 'Clothing Subscription', 'Meal Kit Service'],
      'Other Expenses': [
        'Insurance Premium',
        'Magazine Subscription',
        'Cloud Storage',
      ],
    },
  }

  const typeDescriptions = descriptions[type]?.[category.name] || [
    'Transaction',
  ]
  return getRandomItem(typeDescriptions)
}

export function generateDummyTransactions(
  count: number = 10000
): (Transaction | RecurringTransaction)[] {
  if (count <= 0 || count > 50000) {
    throw new RangeError('count must be between 1 and 50000')
  }

  const transactions: (Transaction | RecurringTransaction)[] = []
  const now = new Date()
  const baseId = Date.now()

  for (let i = 0; i < count; i++) {
    const type = getRandomTransactionType()
    const isIncome = type === 'income'
    const category = getRandomCategory(isIncome ? 'income' : 'expense')
    const date = getRandomDate(24)
    const currency = getRandomCurrency()
    const tags = getRandomTags()
    const dummyTag = '__dummy__'

    const baseTransaction: Omit<
      Transaction,
      'type' | 'accountId' | 'transferToAccountId'
    > &
      Partial<Pick<Transaction, 'type' | 'accountId' | 'transferToAccountId'>> =
      {
        id: `txn_${baseId}_${i}`,
        type,
        status: getRandomStatus(),
        amount: getRandomAmount(1, 10000),
        currency,
        date,
        description: getRandomDescription(type, category),
        categoryId: category.id,
        attachments: [],
        metadata: {
          notes:
            Math.random() > 0.7 ? 'Dummy transaction for testing' : undefined,
          tags: tags.length > 0 ? [...tags, dummyTag] : [dummyTag],
        },
        createdAt: date,
        updatedAt: date,
      }

    if (type === 'transfer') {
      const account = getRandomAccount()
      const otherAccounts = DUMMY_ACCOUNTS.filter((a) => a !== account)
      const transferToAccount = getRandomItem(otherAccounts)
      transactions.push({
        ...baseTransaction,
        type: 'transfer' as const,
        accountId: account,
        transferToAccountId: transferToAccount,
      } as Transaction)
    } else if (type === 'recurring') {
      const generatedTransactionIds: string[] = []
      const nextOccurrence = new Date(date)
      const interval = getRandomInt(1, 6)
      const frequency = getRecurringFrequency()

      if (Math.random() > 0.3) {
        const genCount = getRandomInt(1, 5)
        for (let j = 1; j <= genCount; j++) {
          const genDate = new Date(nextOccurrence)
          switch (frequency) {
            case 'daily':
              genDate.setDate(genDate.getDate() + interval)
              break
            case 'weekly':
              genDate.setDate(genDate.getDate() + interval * 7)
              break
            case 'biweekly':
              genDate.setDate(genDate.getDate() + interval * 14)
              break
            case 'monthly':
              genDate.setMonth(genDate.getMonth() + interval)
              break
            case 'quarterly':
              genDate.setMonth(genDate.getMonth() + interval * 3)
              break
            case 'yearly':
              genDate.setFullYear(genDate.getFullYear() + interval)
              break
          }
          generatedTransactionIds.push(`txn_${baseId}_${i}_gen_${j}`)
        }
      }

      const endDate =
        Math.random() > 0.5
          ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
          : undefined

      transactions.push({
        ...baseTransaction,
        type: 'recurring' as const,
        frequency,
        interval,
        nextOccurrence,
        endDate,
        isActive: Math.random() > 0.1,
        generatedTransactions: generatedTransactionIds,
      } as RecurringTransaction)
    } else {
      transactions.push(baseTransaction as Transaction)
    }
  }

  return transactions
}

export function seedDummyTransactions(count: number = 10000): void {
  const transactions = generateDummyTransactions(count)
  const existingTransactions = storage.getTransactions()
  const allTransactions = [...existingTransactions, ...transactions]
  storage.saveTransactions(allTransactions)
}

export async function seedDummyTransactionsAsync(
  count: number = 10000
): Promise<void> {
  if (count <= 0 || count > 50000) {
    throw new RangeError('count must be between 1 and 50000')
  }

  if (typeof window === 'undefined') {
    seedDummyTransactions(count)
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 0))
  seedDummyTransactions(count)
}

export function clearDummyData(): void {
  const transactions = storage.getTransactions()
  const filtered = transactions.filter(
    (t) => !t.metadata.tags?.includes('__dummy__')
  )
  storage.saveTransactions(filtered)
}

export function clearAllTransactions(): void {
  storage.saveTransactions([])
}
