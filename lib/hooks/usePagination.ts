import { useState, useMemo, useCallback } from 'react'
import { calculatePagination, safePage } from '@/lib/utils/pagination-utils'

interface UsePaginationOptions {
  totalItems: number
  itemsPerPage: number
  onPageChange?: (page: number) => void
}

interface UsePaginationReturn {
  currentPage: number
  safeCurrentPage: number
  totalPages: number
  startRange: number
  endRange: number
  setCurrentPage: (page: number) => void
}

export function usePagination({
  totalItems,
  itemsPerPage,
  onPageChange,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPageState] = useState(1)

  const { totalPages, startRange, endRange } = useMemo(() => {
    return calculatePagination(totalItems, currentPage, itemsPerPage)
  }, [totalItems, currentPage, itemsPerPage])

  const safeCurrentPage = useMemo(() => {
    return safePage(currentPage, totalPages)
  }, [currentPage, totalPages])

  const setCurrentPage = useCallback(
    (page: number) => {
      setCurrentPageState(page)
      onPageChange?.(page)
    },
    [onPageChange]
  )

  return {
    currentPage,
    safeCurrentPage,
    totalPages,
    startRange,
    endRange,
    setCurrentPage,
  }
}
