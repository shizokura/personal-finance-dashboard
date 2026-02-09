# AGENTS.md

## Build Commands

```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting
npx tsc --noEmit         # TypeScript type check
```

### Testing

No test framework configured yet. When adding tests:

- Install Jest or Vitest
- Run single test: `npm test -- path/to/test.spec.ts` or `npm test -- --testNamePattern="pattern"`
- Use `npm run lint` + `npx tsc --noEmit` for validation

---

## Code Style Guidelines

### TypeScript Config

- Strict mode (`"strict": true`)
- Path alias: `@/*` → root
- Target: ES2017, Module: bundler

### Imports

```typescript
import type { Transaction } from '@/lib/types'
import { useState } from 'react'
import Link from 'next/link'
```

- Use `import type` for type-only imports
- External imports first, then internal with `@/` alias

### Formatting (Prettier)

- No semicolons, single quotes, 2-space indent
- Trailing commas (ES5), 80 char line width
- Run `npm run format` before committing

### Linting

- Next.js core-web-vitals + TypeScript configs
- Run `npm run lint` to verify code quality

### Naming Conventions

- Components: `Header`, `DashboardCard` (PascalCase)
- Functions/Variables: `getTransactions`, `isLoading` (camelCase)
- Types/Interfaces: `Transaction`, `MonthlySummary` (PascalCase)
- Constants: `SUPPORTED_CURRENCIES` (UPPER_SNAKE_CASE)
- Files: `transaction.ts`, `Header.tsx` (kebab-case for utils)

### React/Next.js Patterns

```typescript
'use client'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  return <nav>...</nav>
}
```

- Functional components with hooks
- `'use client'` for client components only
- Default exports, Link from `next/link`

### Type Safety

- Prefer explicit types over `any`
- Use interfaces for object shapes
- Export types from `@/lib/types`

### Styling (Tailwind CSS v4)

- Zinc palette for neutrals
- Always include `dark:` variants
- Mobile-first (`sm:`, `md:`, `lg:`)
- Green for positive, red for negative

### Error Handling

- try/catch for async operations
- Validate at boundaries (forms, API)
- Handle loading states gracefully

### Persistence (localStorage)

- Use `storage` singleton from `@/lib/storage`
- Methods: `saveTransaction()`, `getTransactions()`, `deleteTransaction()`
- Check `lib/storage/` for API

### Before Committing

1. `npm run format`
2. `npm run lint`
3. `npx tsc --noEmit`
4. `npm run dev` to verify

---

## Tech Stack

Next.js 16.1.6 (App Router) · React 19.2.3 · Tailwind CSS v4 · TypeScript v5 · Lucide React · ESLint + Prettier

---

## Data Layer

Type-first approach. Models in `lib/types/`:

- `common.ts` - Currency, DateRange, Pagination
- `transaction.ts` - Transaction models
- `category.ts` - Category hierarchy
- `summary.ts` - Analytics types

Import from `@/lib/types` (not individual files)

---

## Project Context

M1/M2 milestone - localStorage persistence, 15 currencies, hierarchical categories. Follow GitHub issues for requirements.

---

## Key Config Files

`tsconfig.json` · `next.config.ts` · `eslint.config.mjs` · `.prettierrc` · `package.json`
