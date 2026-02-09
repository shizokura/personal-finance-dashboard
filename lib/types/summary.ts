import type { TransactionType } from './transaction'
import type { CurrencyCode } from './common'

export interface MonthlySummary {
  period: {
    month: number
    year: number
    startDate: Date
    endDate: Date
  }
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  netSavings: number
  savingsRate: number
  expenseBreakdown: ExpenseBreakdown
  incomeBreakdown: IncomeBreakdown
  transactionStats: MonthlyTransactionStats
  budgetProgress: BudgetProgress[]
}

export interface ExpenseBreakdown {
  total: number
  byCategory: CategoryBreakdown[]
  bySubcategory: SubcategoryBreakdown[]
  topExpenses: TopTransaction[]
}

export interface IncomeBreakdown {
  total: number
  byCategory: CategoryBreakdown[]
  bySubcategory: SubcategoryBreakdown[]
  topIncome: TopTransaction[]
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  transactionCount: number
  color: string
}

export interface SubcategoryBreakdown {
  subcategoryId: string
  subcategoryName: string
  parentId: string
  parentName: string
  amount: number
  percentage: number
  transactionCount: number
}

export interface TopTransaction {
  id: string
  description: string
  amount: number
  categoryId: string
  categoryName: string
  date: Date
}

export interface MonthlyTransactionStats {
  totalTransactions: number
  averageTransactionAmount: number
  byType: Record<
    TransactionType,
    {
      count: number
      total: number
      average: number
    }
  >
}

export interface BudgetProgress {
  categoryId: string
  categoryName: string
  budgetLimit: number
  spent: number
  remaining: number
  percentage: number
  status: 'onTrack' | 'warning' | 'overBudget'
}

export interface MonthlyTrend {
  month: number
  year: number
  periodLabel: string
  income: number
  expenses: number
  savings: number
  savingsRate: number
}

export interface TrendComparison {
  current: MonthlyTrend
  previous?: MonthlyTrend
  change: {
    income: number
    incomePercentage: number
    expenses: number
    expensesPercentage: number
    savings: number
    savingsRate: number
  }
}

export interface DashboardMetrics {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  incomeVsExpenses: {
    income: number
    expenses: number
    difference: number
    percentageChange: number
  }
  recentActivity: {
    transactions: number
    amount: number
  }
  topCategories: {
    category: string
    amount: number
    percentage: number
  }[]
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  currency: CurrencyCode
  status: 'notStarted' | 'inProgress' | 'completed' | 'overdue'
  percentage: number
  remaining: number
  deadline?: Date
  createdAt: Date
  updatedAt: Date
  processedTransactionIds?: string[]
}
