interface CardContainerProps {
  children: React.ReactNode
  title?: React.ReactNode
  className?: string
}

export default function CardContainer({
  children,
  title,
  className = '',
}: CardContainerProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      {title &&
        (typeof title === 'string' ? (
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
        ) : (
          title
        ))}
      {children}
    </div>
  )
}
