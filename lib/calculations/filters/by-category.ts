import type { Transaction, Category } from '@/lib/types'

function getSubcategoryIds(
  categoryId: string,
  categories: Category[]
): string[] {
  const subcategories = categories.filter((cat) => cat.parentId === categoryId)
  let ids: string[] = [categoryId]

  for (const subcat of subcategories) {
    ids = ids.concat(getSubcategoryIds(subcat.id, categories))
  }

  return ids
}

export function filterTransactionsByCategory(
  transactions: Transaction[],
  categoryIds: string[],
  categories: Category[]
): Transaction[] {
  if (categoryIds.length === 0) {
    return transactions
  }

  const allCategoryIds = new Set<string>()
  categoryIds.forEach((id) => {
    const ids = getSubcategoryIds(id, categories)
    ids.forEach((catId) => allCategoryIds.add(catId))
  })

  return transactions.filter((t) => allCategoryIds.has(t.categoryId))
}
