# TripForge

TripForge is a frontend-only local-first PWA for planning a trip to China.

There is no backend, server-side rendering, authentication service, external database, Java, Python API, or Node server runtime. The app is a static Vite build that can be hosted on GitHub Pages, Cloudflare Pages, Nginx, Caddy, or any static file host.

Trip data is intended to be local-first in the browser with IndexedDB via Dexie. Browser storage persistence can reduce cleanup risk, but it is not a replacement for JSON backup import/export.

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

Use `npm run build` followed by `npm run preview` when checking PWA behavior locally. The development server is useful for UI work, but service worker and manifest behavior should be verified from the production build preview.

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

TripForge uses React Router hash routing on GitHub Pages. This avoids any need for server-side routing or a `404.html` fallback on the static host.

Production URLs:

```text
https://lesscau.github.io/trip-forge-pwa/#/
https://lesscau.github.io/trip-forge-pwa/#/trips
https://lesscau.github.io/trip-forge-pwa/#/today
https://lesscau.github.io/trip-forge-pwa/#/settings
```

The PWA manifest uses relative `start_url`, `scope`, and icon paths so the app works from the GitHub Pages subpath.

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
