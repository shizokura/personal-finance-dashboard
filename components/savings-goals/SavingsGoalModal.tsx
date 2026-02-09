'use client'

import type { SavingsGoal } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import SavingsGoalForm from './SavingsGoalForm'

interface SavingsGoalModalProps {
  isOpen: boolean
  onClose: () => void
  goal?: SavingsGoal
}

export default function SavingsGoalModal({
  isOpen,
  onClose,
  goal,
}: SavingsGoalModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goal ? 'Edit Savings Goal' : 'Create Savings Goal'}
    >
      <SavingsGoalForm goal={goal} onCancel={onClose} onSuccess={onClose} />
    </Modal>
  )
}
