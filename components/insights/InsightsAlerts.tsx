'use client'

import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  PiggyBank,
  Target,
} from 'lucide-react'
import type {
  MonthlySummary,
  CategoryBreakdown,
  BudgetProgress,
} from '@/lib/types'
import { formatCurrency } from '@/lib/utils/format-utils'
import CardContainer from '@/components/layout/CardContainer'

type InsightType = 'positive' | 'negative' | 'info'

interface Insight {
  id: string
  type: InsightType
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

interface InsightsAlertsProps {
  currentMonth: MonthlySummary
  previousMonth?: MonthlySummary
  expenseBreakdown: CategoryBreakdown[]
  budgetProgress: BudgetProgress[]
}

export default function InsightsAlerts({
  currentMonth,
  previousMonth,
  expenseBreakdown,
  budgetProgress,
}: InsightsAlertsProps) {
  const currency = 'USD' as const
  const insights: Insight[] = []

  const percentageChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const incomeChange = percentageChange(
    currentMonth.monthlyIncome,
    previousMonth?.monthlyIncome
  )
  const expensesChange = percentageChange(
    currentMonth.monthlyExpenses,
    previousMonth?.monthlyExpenses
  )
  const savingsChange = percentageChange(
    currentMonth.netSavings,
    previousMonth?.netSavings
  )

  if (savingsChange !== null && savingsChange >= 10) {
    insights.push({
      id: 'savings-up',
      type: 'positive',
      icon: PiggyBank,
      title: 'Great Savings!',
      description: `You saved ${formatCurrency(currentMonth.netSavings, currency)} this month - ${savingsChange.toFixed(0)}% more than last month.`,
    })
  } else if (savingsChange !== null && savingsChange < -10) {
    insights.push({
      id: 'savings-down',
      type: 'negative',
      icon: TrendingDown,
      title: 'Savings Decreased',
      description: `Your savings decreased by ${Math.abs(savingsChange).toFixed(0)}% compared to last month.`,
    })
  }

  if (incomeChange !== null && incomeChange > 10) {
    insights.push({
      id: 'income-up',
      type: 'positive',
      icon: TrendingUp,
      title: 'Income Increased',
      description: `Your income increased by ${incomeChange.toFixed(0)}% compared to last month.`,
    })
  }

  if (expensesChange !== null && expensesChange > 15) {
    const topCategory = expenseBreakdown[0]
    insights.push({
      id: 'expenses-up',
      type: 'negative',
      icon: TrendingUp,
      title: 'Spending Increased',
      description: `Your expenses increased by ${expensesChange.toFixed(0)}% compared to last month. Top category: ${topCategory?.categoryName || 'N/A'}.`,
    })
  } else if (expensesChange !== null && expensesChange < -10) {
    insights.push({
      id: 'expenses-down',
      type: 'positive',
      icon: TrendingDown,
      title: 'Reduced Spending',
      description: `Great job! Your expenses decreased by ${Math.abs(expensesChange).toFixed(0)}% compared to last month.`,
    })
  }

  const overBudgetCount = budgetProgress.filter(
    (b) => b.status === 'overBudget'
  ).length
  if (overBudgetCount > 0) {
    insights.push({
      id: 'over-budget',
      type: 'negative',
      icon: AlertCircle,
      title: 'Over Budget',
      description: `${overBudgetCount} categor${overBudgetCount === 1 ? 'y is' : 'ies are'} over budget this month. Review your spending in the Budgets page.`,
    })
  }

  const warningBudgets = budgetProgress.filter((b) => b.status === 'warning')
  if (warningBudgets.length > 0 && warningBudgets.length <= 2) {
    const names = warningBudgets.map((b) => b.categoryName).join(', ')
    insights.push({
      id: 'approaching-budget',
      type: 'info',
      icon: AlertCircle,
      title: 'Approaching Budget',
      description: `Watch your spending in ${names}. ${warningBudgets.length > 1 ? 'These categories are' : 'This category is'} approaching the budget limit.`,
    })
  }

  const topExpense = expenseBreakdown[0]
  if (topExpense && topExpense.percentage > 30) {
    insights.push({
      id: 'top-category',
      type: 'info',
      icon: Info,
      title: `High Spending in ${topExpense.categoryName}`,
      description: `${topExpense.categoryName} accounts for ${topExpense.percentage.toFixed(0)}% of your expenses this month.`,
    })
  }

  const savingsRate = currentMonth.savingsRate ?? 0
  if (savingsRate >= 20) {
    insights.push({
      id: 'savings-rate-excellent',
      type: 'positive',
      icon: Target,
      title: 'Excellent Savings Rate',
      description: `Your savings rate is ${savingsRate.toFixed(0)}%, which is above the recommended 20%. Keep up the great work!`,
    })
  } else if (savingsRate > 0 && savingsRate < 10) {
    insights.push({
      id: 'savings-rate-low',
      type: 'info',
      icon: Info,
      title: 'Low Savings Rate',
      description: `Your savings rate is ${savingsRate.toFixed(0)}%. Consider reducing expenses or increasing income to reach 20%.`,
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'no-insights',
      type: 'info',
      icon: Info,
      title: 'Add More Transactions',
      description:
        'Continue tracking your transactions to receive personalized insights about your spending patterns.',
    })
  }

  const typeStyles = {
    positive:
      'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100',
    negative:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100',
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100',
  }

  const iconStyles = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  }

  return (
    <CardContainer title="Insights">
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div
              key={insight.id}
              className={`flex gap-3 rounded-lg border p-4 ${typeStyles[insight.type]}`}
            >
              <div className={`flex-shrink-0 ${iconStyles[insight.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{insight.title}</p>
                <p className="mt-1 text-sm opacity-90">{insight.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </CardContainer>
  )
}
