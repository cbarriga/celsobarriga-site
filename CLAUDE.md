# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build (includes Pagefind indexing)
npm run preview      # Preview production build locally

# Content
npm run create       # CLI to create new journal entries
npm run update-post  # Update existing post metadata

# Linting
npm run lint:site    # Full validation: build + HTML validate + link check
npm run lint:html    # HTML validation only
npm run lint:links   # Internal link checking only
```

Build uses Bun internally; use npm for running scripts.

## Architecture

**Astro 6 SSG** with selective React islands. All pages are pre-rendered at build time.

### Astro vs React
- Use `.astro` components for static content (zero JS shipped)
- Use `.tsx` React components only for client-side interactivity, hydrated with `client:idle` or `client:load`
- Current React islands: `ThemeToggle.tsx`, `Hamburger.tsx`, `HeroImage.tsx`, `ScrollToTop.tsx`

### Routing
File-based via `src/pages/`. Dynamic routes use `getStaticPaths()`:
- `journal/[...id].astro` — individual post pages
- `journal/tags/[tag].astro` — tag index pages
- `journal/rss.xml.ts` — RSS feed

### Content Collections
Defined in `src/content.config.ts` using Astro's glob loader pattern. MDX files in `src/content/journal/`. Files prefixed with `_` are treated as drafts and excluded. Frontmatter is validated with Zod.

Shared helpers in `src/scripts/collections.ts`:
- `buildDetailPaths()` — generates `getStaticPaths()` entries for post pages
- `buildTagPaths()` — generates tag pages
- `generateRss()` — RSS feed generation

### Theme System
`src/scripts/theme.ts` is the single source of truth for dark/light mode. It manages `localStorage` and the DOM class. `ThemeToggle.tsx` is a pure UI layer using events and a `MutationObserver` to stay in sync. Theme is re-applied on `astro:after-swap` for View Transitions.

### Styling
Tailwind CSS 4 with photography-optimized custom breakpoints: `sm:800px`, `md:1200px`, `lg:1900px`, `xl:2500px`, `2xl:3800px`. Dark mode uses the `class` strategy. Global styles in `src/styles/global.css`.

### Constants & Utilities
- `src/consts.ts` — site-wide constants
- `src/scripts/utils.ts` — `shuffle()`, `formatDate()`
- `src/scripts/duration.ts` — timeline duration calculations

## Project Structure

```
src/
  components/     PascalCase .astro and .tsx files
  content/        MDX content collections (journal only)
  content.config.ts   Zod schema for journal collection
  consts.ts       Site-wide constants (title, author, CDN URLs)
  layouts/        PascalCase .astro layout files
  pages/          File-based routing
  scripts/        camelCase helpers
  styles/         global.css (Tailwind entry point)
public/           Static assets (favicon, etc.)
_inbox/           Staging folder for photo candidates (never published)
```

## Entry Structure

```
src/content/journal/[place]-[YYYY-MM]/
  index.mdx       Content and frontmatter
  01-name.jpg     Photos (numbered for organization, not story order)
  02-name.jpg
```

## Deployment

**Vercel** — primary deployment. Watches `main` and auto-deploys on every push to `www.celsobarriga.com`. `celsobarriga.com` → 301 redirect to `www.celsobarriga.com`.

CI/CD via `.github/workflows/deploy.yml`: runs tests and build on every push/PR to `main`.

## Commit Style

Conventional commits: `feat:`, `fix:`, `chore:`, `content:`

Example: `content: add nashville-2026-03 journal entry`