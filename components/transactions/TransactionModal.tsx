'use client'

import type { Transaction } from '@/lib/types'
import TransactionForm from '@/components/TransactionForm'
import Modal from '@/components/ui/Modal'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction?: Transaction
}

export default function TransactionModal({
  isOpen,
  onClose,
  transaction,
}: TransactionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Transaction"
      maxWidth="max-w-lg"
      maxHeight="max-h-[90vh]"
    >
      <TransactionForm
        transaction={transaction}
        onCancel={onClose}
        onSuccess={onClose}
      />
    </Modal>
  )
}
