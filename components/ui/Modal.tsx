'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  maxWidth?: string
  maxHeight?: string
  children: React.ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  maxWidth = 'max-w-lg',
  maxHeight = 'max-h-[80vh]',
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !mounted) {
    return null
  }

  const portalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${maxWidth} ${maxHeight} flex flex-col rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {title}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">{children}</div>
      </div>
    </div>
  )

  try {
    return createPortal(portalContent, document.body)
  } catch (error) {
    console.error('createPortal error:', error)
    return null
  }
}
