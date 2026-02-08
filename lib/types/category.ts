export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: CategoryType
  icon?: string
  color: string
  parentId?: string
  budgetLimit?: number
  children?: Category[]
  createdAt: Date
  updatedAt: Date
}

export interface Subcategory extends Omit<
  Category,
  'children' | 'budgetLimit'
> {
  parentId: string
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
  totalBudget?: number
}

export interface CategoryFormData {
  name: string
  type: CategoryType
  icon?: string
  color: string
  parentId?: string
  budgetLimit?: number
}

export interface CategoryWithTransactions {
  category: Category
  transactionCount: number
  totalAmount: number
  budgetUsage?: number
  budgetPercentage?: number
}
