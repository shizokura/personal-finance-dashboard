export type PageNumber = number | '...'

export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): PageNumber[] {
  const pages: PageNumber[] = []

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
}

export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const safeCurrentPage = safePage(currentPage, totalPages)
  const offset = (safeCurrentPage - 1) * itemsPerPage
  const startRange = totalItems > 0 ? offset + 1 : 0
  const endRange = Math.min(offset + itemsPerPage, totalItems)

  return {
    totalPages,
    offset,
    startRange,
    endRange,
  }
}

export function safePage(currentPage: number, totalPages: number): number {
  if (currentPage > totalPages) {
    return 1
  }
  return currentPage
}
