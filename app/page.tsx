export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Overview of your financial health
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Total Balance
          </h3>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            $0.00
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Monthly Income
          </h3>
          <p className="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
            $0.00
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Monthly Expenses
          </h3>
          <p className="mt-2 text-2xl font-semibold text-red-600 dark:text-red-400">
            $0.00
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Savings Rate
          </h3>
          <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            0%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Expense Breakdown
          </h2>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Your expense breakdown will appear here once you add transactions.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Recent Transactions
          </h2>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Your recent transactions will appear here once you add entries.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Monthly Trend
        </h2>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Your monthly spending trend will appear here once you have transaction
          data.
        </p>
      </div>
    </div>
  )
}
