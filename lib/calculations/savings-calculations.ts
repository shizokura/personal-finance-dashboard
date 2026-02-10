import type { Transaction, SavingsGoal } from '@/lib/types'

export function calculateSavingsGoalProgress(goal: SavingsGoal): SavingsGoal {
  const { targetAmount, currentAmount, deadline } = goal

  const percentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0
  const remaining = targetAmount - currentAmount

  let status: 'notStarted' | 'inProgress' | 'completed' | 'overdue' =
    'notStarted'

  if (percentage >= 100) {
    status = 'completed'
  } else if (percentage > 0) {
    status = 'inProgress'
    if (deadline && new Date() > deadline) {
      status = 'overdue'
    }
  } else if (deadline && new Date() > deadline) {
    status = 'overdue'
  }

  return {
    ...goal,
    percentage,
    remaining,
    status,
  }
}

export function updateGoalsFromTransactions(
  goals: SavingsGoal[],
  _transactions: Transaction[] // eslint-disable-line @typescript-eslint/no-unused-vars
): SavingsGoal[] {
  // TODO: Implement proper transaction-to-goal matching logic
  return goals.map((goal) => calculateSavingsGoalProgress(goal))
}

export function getActiveGoals(goals: SavingsGoal[]): SavingsGoal[] {
  return goals.filter((g) => g.status !== 'completed')
}

export function getCompletedGoals(goals: SavingsGoal[]): SavingsGoal[] {
  return goals.filter((g) => g.status === 'completed')
}

export function getOverdueGoals(goals: SavingsGoal[]): SavingsGoal[] {
  return goals.filter((g) => g.status === 'overdue')
}

export function sortGoalsByPriority(goals: SavingsGoal[]): SavingsGoal[] {
  return [...goals].sort((a, b) => {
    const priority = (goal: SavingsGoal) => {
      if (goal.status === 'overdue') return 0
      if (goal.status === 'completed') return 4
      if (goal.deadline) {
        const daysToDeadline = Math.ceil(
          (goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        if (daysToDeadline <= 7) return 1
        if (daysToDeadline <= 30) return 2
      }
      return 3
    }

    return priority(a) - priority(b)
  })
}
