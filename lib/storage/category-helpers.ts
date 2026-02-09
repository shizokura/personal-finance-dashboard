import type { Category } from '@/lib/types'
import storage from './storage-service'

export interface DeleteCheckResult {
  canDelete: boolean
  hasTransactions: boolean
  transactionCount: number
  hasChildCategories: boolean
  childCategoryCount: number
  reason?: string
}

export function canDeleteCategory(categoryId: string): DeleteCheckResult {
  const categories = storage.getCategories()
  const category = categories.find((cat) => cat.id === categoryId)

  if (!category) {
    return {
      canDelete: false,
      hasTransactions: false,
      transactionCount: 0,
      hasChildCategories: false,
      childCategoryCount: 0,
      reason: 'Category not found',
    }
  }

  const transactions = storage.getTransactions()
  const transactionCount = transactions.filter(
    (txn) => txn.categoryId === categoryId || txn.subcategoryId === categoryId
  ).length

  const childCategories = categories.filter(
    (cat) => cat.parentId === categoryId
  )
  const hasChildCategories = childCategories.length > 0

  if (hasChildCategories) {
    return {
      canDelete: true,
      hasTransactions: transactionCount > 0,
      transactionCount,
      hasChildCategories: true,
      childCategoryCount: childCategories.length,
      reason: 'Category has subcategories that will also be deleted',
    }
  }

  if (transactionCount > 0) {
    return {
      canDelete: true,
      hasTransactions: true,
      transactionCount,
      hasChildCategories: false,
      childCategoryCount: 0,
      reason: 'Category has transactions',
    }
  }

  return {
    canDelete: true,
    hasTransactions: false,
    transactionCount: 0,
    hasChildCategories: false,
    childCategoryCount: 0,
  }
}

export function getCategoryTransactionCount(categoryId: string): number {
  const transactions = storage.getTransactions()
  return transactions.filter(
    (txn) => txn.categoryId === categoryId || txn.subcategoryId === categoryId
  ).length
}

export function getAllTransactionCount(categoryId: string): number {
  let count = getCategoryTransactionCount(categoryId)

  const categories = storage.getCategories()
  const childCategories = categories.filter(
    (cat) => cat.parentId === categoryId
  )

  childCategories.forEach((child) => {
    count += getAllTransactionCount(child.id)
  })

  return count
}

export function getAllChildCategoryIds(categoryId: string): string[] {
  const categories = storage.getCategories()
  const childIds: string[] = []
  const childCategories = categories.filter(
    (cat) => cat.parentId === categoryId
  )

  childCategories.forEach((child) => {
    childIds.push(child.id)
    childIds.push(...getAllChildCategoryIds(child.id))
  })

  return childIds
}

export function reassignTransactions(
  fromCategoryId: string,
  toCategoryId: string
): void {
  const transactions = storage.getTransactions()
  const updatedTransactions = transactions.map((txn) => {
    if (txn.categoryId === fromCategoryId) {
      return { ...txn, categoryId: toCategoryId }
    }
    if (txn.subcategoryId === fromCategoryId) {
      return { ...txn, subcategoryId: toCategoryId }
    }
    return txn
  })

  storage.saveTransactions(updatedTransactions)
}

export function unassignTransactions(categoryId: string): void {
  const transactions = storage.getTransactions()
  const updatedTransactions = transactions.map((txn) => {
    if (txn.categoryId === categoryId) {
      return { ...txn, categoryId: '' }
    }
    if (txn.subcategoryId === categoryId) {
      return { ...txn, subcategoryId: undefined }
    }
    return txn
  })

  storage.saveTransactions(updatedTransactions)
}

export function deleteCategoryWithDependencies(categoryId: string): void {
  const categories = storage.getCategories()
  const childIds = getAllChildCategoryIds(categoryId)
  const allIdsToDelete = [categoryId, ...childIds]

  const transactions = storage.getTransactions()
  const updatedTransactions = transactions.map((txn) => {
    if (allIdsToDelete.includes(txn.categoryId)) {
      return { ...txn, categoryId: '' }
    }
    if (txn.subcategoryId && allIdsToDelete.includes(txn.subcategoryId)) {
      return { ...txn, subcategoryId: undefined }
    }
    return txn
  })

  storage.saveTransactions(updatedTransactions)

  const updatedCategories = categories.filter(
    (cat) => !allIdsToDelete.includes(cat.id)
  )
  storage.saveCategories(updatedCategories)
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
}

export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>()
  const rootNodes: CategoryTreeNode[] = []

  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] })
  })

  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)
    if (!node) return

    if (cat.parentId) {
      const parent = categoryMap.get(cat.parentId)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      rootNodes.push(node)
    }
  })

  return rootNodes
}

export function getCategoryWithChildren(
  categoryId: string
): CategoryTreeNode | null {
  const categories = storage.getCategories()
  const category = categories.find((cat) => cat.id === categoryId)

  if (!category) return null

  const tree = buildCategoryTree(categories)

  function findNode(nodes: CategoryTreeNode[]): CategoryTreeNode | null {
    for (const node of nodes) {
      if (node.id === categoryId) return node
      if (node.children.length > 0) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
    return null
  }

  return findNode(tree)
}

export function getDefaultCategoryByType(
  type: 'income' | 'expense'
): Category | null {
  const categories = storage.getCategories()
  const defaultName = type === 'income' ? 'Other Income' : 'Other Expenses'
  return (
    categories.find((cat) => cat.type === type && cat.name === defaultName) ||
    null
  )
}
