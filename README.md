# celsobarriga.com

Photography journal and personal site built with Astro 6, deployed to Vercel.

## Stack

- **Astro 6** — static site generation, MDX content, content collections
- **Tailwind CSS 4** — utility-first styling, custom breakpoints for photography display
- **React** — used only for interactive islands (theme toggle, hero parallax, scroll-to-top, mobile menu)
- **Pagefind** — client-side search, indexed at build time
- **Git LFS** — photo storage (`.jpg`, `.jpeg`, `.png` tracked via LFS)

## Deployment

Vercel watches `main` and auto-deploys on every push. No manual deploy step needed.

```
git push origin main  →  auto-deploys to www.celsobarriga.com
```

## Local Development

```bash
nvm use 22
npm install --legacy-peer-deps
npm run dev        # http://localhost:4321
npm run build      # production build
npm run preview    # preview production build locally
npm test           # run test suite
```

## Content

All journal entries live in `src/content/journal/`. Each entry is a folder:

```
src/content/journal/
  travels/
    nashville-2026-03/
      index.mdx        ← frontmatter + prose
      01-photo.jpg
      02-photo.jpg
  walks/
    boston-2026-05/
      index.mdx
      01-photo.jpg
```

The folder name becomes the URL slug. Co-locating photos with the post keeps assets and content together.

### Frontmatter

```yaml
---
title: "Nashville, Three Days"
description: "A workshop with Thorsten Overgaard."
tags: ["nashville", "workshop", "leica"]
author: "Celso Barriga"
pubDate: 2026-03-15
image:
  src: "./cover.jpg"
  alt: "Description of the cover photo"
  positionx: "50%"   # optional focal point
  positiony: "30%"
---
```

## CI

GitHub Actions runs on every push and pull request to `main`:
1. Checkout (with LFS)
2. Install dependencies
3. Run tests (`npm test`)
4. Build (`npm run build`)

Vercel handles the actual deployment independently.
