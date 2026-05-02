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
