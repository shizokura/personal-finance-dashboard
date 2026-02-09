import { useState, useMemo, useCallback } from 'react'
import { calculatePagination } from '@/lib/utils/pagination-utils'

interface UsePaginationOptions {
  totalItems: number
  itemsPerPage: number
  onPageChange?: (page: number) => void
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  startRange: number
  endRange: number
  offset: number
  setCurrentPage: (page: number) => void
}

export function usePagination({
  totalItems,
  itemsPerPage,
  onPageChange,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPageState] = useState(1)

  const { totalPages, offset: rawOffset } = useMemo(() => {
    return calculatePagination(totalItems, currentPage, itemsPerPage)
  }, [totalItems, currentPage, itemsPerPage])

  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages))

  const offset =
    safeCurrentPage === currentPage
      ? rawOffset
      : (safeCurrentPage - 1) * itemsPerPage

  const finalStartRange = totalItems > 0 ? offset + 1 : 0
  const finalEndRange = Math.min(offset + itemsPerPage, totalItems)

  const setCurrentPage = useCallback(
    (page: number) => {
      const safePage = Math.min(page, Math.max(1, totalPages))
      setCurrentPageState(safePage)
      onPageChange?.(safePage)
    },
    [onPageChange, totalPages]
  )

  return {
    currentPage: safeCurrentPage,
    totalPages,
    startRange: finalStartRange,
    endRange: finalEndRange,
    offset,
    setCurrentPage,
  }
}
