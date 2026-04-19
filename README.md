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

## Environment Setup (VSCode)

### Prerequisites

- **Node.js 22** via [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install 22
  nvm use 22
  ```
- **Git LFS** — required for photos stored in LFS:
  ```bash
  # macOS
  brew install git-lfs
  git lfs install
  ```

### Clone

```bash
git clone https://github.com/cbarriga/celsobarriga-site.git
cd celsobarriga-site
```

Git LFS files (photos) download automatically on clone. If they didn't:
```bash
git lfs pull
```

### VSCode Extensions

Open the repo in VSCode — it will prompt to install the recommended extension:

- **Astro** (`astro-build.astro-vscode`) — syntax highlighting, IntelliSense, and type checking for `.astro` files

Also useful:
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — autocomplete for Tailwind classes
- **MDX** (`unifiedjs.vscode-mdx`) — syntax highlighting for `.mdx` files

### Install and Run

```bash
npm install --legacy-peer-deps
```

Then open two terminals:

```bash
# Terminal 1
npm run dev        # http://localhost:4321

# Terminal 2
npm run test:watch # re-runs tests on every file save
```

## Local Development

```bash
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
