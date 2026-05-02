# TripForge

TripForge is a frontend-only local-first PWA for planning a trip to China.

There is no backend, server-side rendering, authentication service, external database, Java, Python API, or Node server runtime. The app is a static Vite build that can be hosted on GitHub Pages, Cloudflare Pages, Nginx, Caddy, or any static file host.

## Stack

- Vite
- React
- TypeScript
- React Router
- PWA service worker and web app manifest
- IndexedDB via Dexie
- Zod for runtime validation of imported backup data
- Vitest
- ESLint

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Check

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`.

On every push to `main`, it runs:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Then it deploys the generated `dist/` directory to GitHub Pages.

In GitHub, enable Pages with:

1. Open repository settings.
2. Go to Pages.
3. Set Source to GitHub Actions.

For project pages, the workflow builds with `VITE_BASE_PATH` set to the repository name path, such as `/trip-forge-pwa/`. Local builds keep the default `/` base path.

## Project Structure

```text
src/
  app/       App shell, routing, and pages
  db/        IndexedDB/Dexie setup and local data types
  export/    JSON backup import/export validation
  features/  Product feature modules
  maps/      Map link helpers
  shared/    Shared UI and utilities
  styles/    Global styles
```
