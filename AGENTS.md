# Repository Guidelines

## Overview
Astro 6 static photography journal (celsobarriga.com) with MDX content,
React islands, Tailwind CSS v4, and Pagefind search.
Deployed to Vercel via GitHub auto-deploy. Runtime is Node 22.

## Project Structure
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

## Content Collections
One collection: journal. Defined in content.config.ts with baseSchema
(title, tags, author, description, image?, pubDate, updatedDate?).

## Entry Structure
src/content/journal/[place]-[YYYY-MM]/
  index.mdx       Content and frontmatter
  01-name.jpg     Photos (numbered for organization, not story order)
  02-name.jpg

## Development
nvm use 22
npm install --legacy-peer-deps
npm run dev        # http://localhost:4321
npm run build      # Production build

## Deployment
git push origin main → Vercel auto-deploys to www.celsobarriga.com
celsobarriga.com → 301 redirect to www.celsobarriga.com

## Commit Style
Conventional commits: feat:, fix:, chore:, content:
Example: content: add nashville-2025-02 journal entry