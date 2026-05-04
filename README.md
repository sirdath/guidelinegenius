# Guideline Genius

Next.js rebuild of [guidelinegenius.com](https://www.guidelinegenius.com/) — UK medical guidelines distilled for UKMLA learners.

Built with Next.js 15 · Tailwind · 383 articles · 21 specialties.

Live demo: https://sirdath.github.io/guidelinegenius/

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Build

```bash
pnpm exec next build  # static export → out/
```

The repo is configured for static export so GitHub Pages can serve it directly.
