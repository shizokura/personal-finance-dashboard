import { RefreshCw, AlertCircle, Inbox } from 'lucide-react'
import Link from 'next/link'

type EmptyStateVariant = 'empty' | 'loading' | 'error'

interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
  variant?: EmptyStateVariant
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

const variantIcons: Record<EmptyStateVariant, React.ReactNode> = {
  empty: <Inbox className="h-8 w-8" />,
  loading: <RefreshCw className="h-8 w-8 animate-spin" />,
  error: <AlertCircle className="h-8 w-8" />,
}

const variantColors: Record<EmptyStateVariant, string> = {
  empty: 'text-zinc-400',
  loading: 'text-zinc-400',
  error: 'text-red-400',
}

export default function EmptyState({
  message,
  icon,
  variant = 'empty',
  action,
}: EmptyStateProps) {
  const displayIcon = icon || variantIcons[variant]
  const iconColor = variantColors[variant]

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <div className={`mb-3 ${iconColor}`}>{displayIcon}</div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  )
}
