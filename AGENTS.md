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

This project does not currently have a test framework configured. When adding tests:

- Add Jest or Vitest configuration
- Use `npm run lint` as the primary validation command
- Run `npx tsc --noEmit` to verify TypeScript types before submitting changes

---

## Code Style Guidelines

### TypeScript Configuration

- Strict mode enabled (`"strict": true`)
- Path alias: `@/*` maps to root
- Target: ES2017, Module: bundler

### Imports

- Use `import type` for type-only imports
- Group external imports first, then internal
- Use `@/` alias for internal imports

```typescript
import type { Transaction } from '@/lib/types'
import { useState } from 'react'
import Link from 'next/link'
```

### Formatting (Prettier)

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 2 spaces indentation (`tabWidth: 2`)
- Trailing commas in ES5 style (`trailingComma: "es5"`)
- 80 character line width (`printWidth: 80`)
- Always run `npm run format` before committing

### Linting (ESLint)

- Uses Next.js core-web-vitals and TypeScript configs
- Prettier integration to avoid conflicts
- Run `npm run lint` to verify code quality
- Fix linting errors before committing

### Naming Conventions

- **Components**: PascalCase (e.g., `Header`, `DashboardCard`)
- **Functions/Variables**: camelCase (e.g., `getTransactions`, `isLoading`)
- **Types/Interfaces**: PascalCase (e.g., `Transaction`, `MonthlySummary`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SUPPORTED_CURRENCIES`)
- **Files**: kebab-case for utilities, PascalCase for components (e.g., `transaction.ts`, `Header.tsx`)

### React/Next.js Patterns

- Use functional components with hooks
- Add `'use client'` directive for client-side components
- Default exports for pages and components
- Use Link from `next/link` for navigation
- Server components by default, client components only when needed

```typescript
'use client'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  return <nav>...</nav>
}
```

### Type Safety

- Prefer explicit types over `any`
- Use interfaces for object shapes with clear contracts
- Use type aliases for union types and utility types
- Export types from `lib/types/index.ts` for reuse

### Styling (Tailwind CSS v4)

- Use zinc color palette for neutral colors
- Always include dark mode variants (`dark:` prefix)
- Follow mobile-first responsive design (`sm:`, `md:`, `lg:`)
- Use semantic color scales (green for positive, red for negative)

### Error Handling

- Use try/catch for async operations
- Validate data at boundaries (forms, API calls)
- Provide meaningful error messages
- Handle loading states gracefully

### File Organization

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Shared utilities, helpers, and type definitions
- `lib/types/` - TypeScript type definitions
- `public/` - Static assets

### Before Committing

1. Run `npm run format` to format all files
2. Run `npm run lint` to check for code quality issues
3. Run `npx tsc --noEmit` to verify TypeScript types
4. Test the changes locally with `npm run dev`
5. Ensure no console errors or warnings

---

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS v4
- **TypeScript**: v5 (strict mode)
- **Icons**: Lucide React
- **Linting**: ESLint + Prettier

---

## Data Layer

The application uses a type-first approach with all data models defined in `lib/types/`:

- `common.ts` - Shared utilities (Currency, DateRange, Pagination)
- `transaction.ts` - Transaction models and types
- `category.ts` - Category hierarchy and types
- `summary.ts` - Monthly summary and analytics types

Always import types from `@/lib/types` rather than individual files to maintain consistency.

---

## Development Notes

- This is a new project (M1 milestone) - focus on core data structures first
- localStorage will be used for persistence (no database yet)
- Multi-currency support with 15 currencies
- Hierarchical category structure (parent/child relationships)
- Follow the GitHub issues for feature requirements

---

## Important Files

- `tsconfig.json` - TypeScript config
- `next.config.ts` - Next.js config
- `eslint.config.mjs` - ESLint rules
- `.prettierrc` - Prettier rules
- `package.json` - Dependencies and scripts
