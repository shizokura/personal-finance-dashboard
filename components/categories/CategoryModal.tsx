'use client'

import type { Category } from '@/lib/types'
import CategoryForm from './CategoryForm'
import Modal from '@/components/ui/Modal'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      maxWidth="max-w-lg"
      maxHeight="max-h-[90vh]"
    >
      <CategoryForm
        category={category}
        onCancel={onClose}
        onSuccess={onClose}
      />
    </Modal>
  )
}
