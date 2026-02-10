'use client'

import { useState, useEffect } from 'react'
import type { MonthlySummary, MonthlyTrend, TrendComparison } from '@/lib/types'
import type { Transaction, Category } from '@/lib/types'
import {
  calculateMonthlySummary,
  calculateMonthlyTrends,
  calculateTrendComparison,
} from '@/lib/calculations'
import storage, { storageEvents } from '@/lib/storage'
import { TREND_MONTHS } from '@/lib/constants'

interface UseDashboardDataParams {
  currentMonth: number
  currentYear: number
}

interface UseDashboardDataReturn {
  summary: MonthlySummary | null
  trends: MonthlyTrend[]
  comparison: TrendComparison | null
  transactions: Transaction[]
  categories: Category[]
  isLoading: boolean
  error: Error | null
}

export function useDashboardData({
  currentMonth,
  currentYear,
}: UseDashboardDataParams): UseDashboardDataReturn {
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [trends, setTrends] = useState<MonthlyTrend[]>([])
  const [comparison, setComparison] = useState<TrendComparison | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true)
        setError(null)
        const txns: Transaction[] = storage.getTransactions()
        const cats: Category[] = storage.getCategories()

        setTransactions(txns)
        setCategories(cats)

        const monthSummary = calculateMonthlySummary(
          currentMonth,
          currentYear,
          txns,
          cats
        )
        setSummary(monthSummary)

        const monthTrends = calculateMonthlyTrends(txns, cats, TREND_MONTHS)
        setTrends(monthTrends)

        if (monthTrends.length >= 2) {
          const currentTrend = monthTrends[monthTrends.length - 1]
          const previousTrend = monthTrends[monthTrends.length - 2]
          const trendComp = calculateTrendComparison(
            currentTrend,
            previousTrend
          )
          setComparison(trendComp)
        } else {
          setComparison(null)
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    const unsubscribe = storageEvents.on('transactions', loadData)
    const unsubscribe2 = storageEvents.on('categories', loadData)

    return () => {
      unsubscribe?.()
      unsubscribe2?.()
    }
  }, [currentMonth, currentYear])

  return {
    summary,
    trends,
    comparison,
    transactions,
    categories,
    isLoading,
    error,
  }
}
