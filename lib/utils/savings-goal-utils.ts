import type { SavingsGoal } from '@/lib/types'

export function getProgressColor(status: SavingsGoal['status']): string {
  switch (status) {
    case 'completed':
      return 'bg-green-600 dark:bg-green-400'
    case 'overdue':
      return 'bg-red-600 dark:bg-red-400'
    case 'inProgress':
      return 'bg-blue-600 dark:bg-blue-400'
    case 'notStarted':
      return 'bg-zinc-400 dark:bg-zinc-500'
  }
}

export function getStatusColor(status: SavingsGoal['status']): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'inProgress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'notStarted':
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
  }
}

export function getStatusText(status: SavingsGoal['status']): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'overdue':
      return 'Overdue'
    case 'inProgress':
      return 'In Progress'
    case 'notStarted':
      return 'Not Started'
  }
}
