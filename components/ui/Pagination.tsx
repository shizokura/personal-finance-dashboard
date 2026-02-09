'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPageNumbers } from '@/lib/utils/pagination-utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  startRange: number
  endRange: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  startRange,
  endRange,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {startRange}-{endRange} of {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:hover:bg-transparent dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:dark:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {getPageNumbers(currentPage, totalPages).map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`min-w-[2.25rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className="px-2.5 py-1.5 text-sm text-zinc-500 dark:text-zinc-400"
            >
              {page}
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:hover:bg-transparent dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:dark:hover:bg-transparent"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
