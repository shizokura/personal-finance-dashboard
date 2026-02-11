# Personal Finance Dashboard

A modern personal finance dashboard built with Next.js, React, TypeScript, and Tailwind CSS.

## Documentation

- **AGENTS.md** - Development guidelines, build commands, code style, and technical stack information
- **prd/** - Product Requirements Documents for new features and architecture changes
  - PRD-001: Single Currency & Insights (Current Sprint)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project is configured for seamless deployment on Vercel with automatic preview deployments for all pull requests.

### Quick Setup

1. **Connect Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js framework

2. **Configure Build Settings** (automatically detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy" to deploy your main branch to production
   - Your app will be live at `https://your-project.vercel.app`

### Deployment Workflow

- **Production**: Commits to your default branch trigger production deployments
- **Preview**: All pull requests automatically deploy to preview URLs for testing
- **Rollback**: View deployment history in Vercel dashboard to rollback if needed

### Configuration

The `vercel.json` file in the project root contains:

- Build optimization settings
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Rewrite rules for SPA-like navigation

### Troubleshooting

**Build fails locally?**

```bash
npm run build
npx tsc --noEmit
```

**Environment variables not working?**

- Check Vercel dashboard → Settings → Environment Variables
- Ensure they're set for correct environment (Production/Preview/Development)

**Static assets not loading?**

- Verify `public/` folder contents are committed to git
- Check build logs for asset compilation errors

### Learn More

- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Next.js Guide](https://vercel.com/docs/frameworks/nextjs)
