# AGENTS.md

## Project Context

TripForge is a local-first PWA for planning a trip to China.

This repository must stay a static frontend application. There is no backend and there should be no backend-related runtime, infrastructure, or architecture.

The app should be buildable with:

```bash
npm run build
```

The build output should be deployable as static files to GitHub Pages, Cloudflare Pages, Nginx, Caddy, or any equivalent static host.

## Required Stack

- React
- TypeScript
- Vite
- PWA
- IndexedDB via Dexie
- Zod for runtime validation of imported data
- React Router
- CSS Modules or plain CSS
- Vitest for unit tests

## Explicit Non-Goals

Do not add:

- Java
- Spring Boot
- Python API
- Node server runtime
- PostgreSQL
- Docker backend
- Server-side rendering
- Backend services
- Authentication
- External database
- Heavy UI frameworks
- Unnecessary dependencies

## Architecture Rules

- Store all application data locally in IndexedDB.
- Use Dexie as the IndexedDB access layer.
- Provide JSON import/export for backups.
- Validate imported JSON data at runtime with Zod.
- The app must work offline after the first successful opening.
- Keep the code simple, readable, and easy to extend.
- Prefer small, explicit modules over broad abstractions.
- Avoid adding dependencies unless they clearly reduce complexity or are required by the stack.

## Domain Model

Core domain entities:

- `Trip`
- `TripDay`
- `Place`
- `Expense`
- `Booking`
- `TravelDocument`
- `Note`
- `ChecklistItem`

Keep naming consistent with these entities unless there is a clear domain reason to introduce a new term.

## UX Goals

The app is intended for use from a phone during travel.

Prioritize:

- Today screen
- Itinerary grouped by day
- Places with Chinese names and addresses
- Expenses
- Bookings and travel documents
- Offline backup/export
- Buttons to copy Chinese addresses
- Links to open places in Amap, Baidu Maps, and Apple Maps

Design should be practical, compact, and reliable for mobile use while traveling.

## Development Workflow

After each task:

- Update `README.md` if project structure, commands, setup, or behavior changed.
- Run `npm test` if tests exist.
- Run `npm run build`.
- Do not leave TODO comments unless they are necessary and actionable.

## Implementation Guidance

- Keep the app fully client-side.
- Use static assets and browser APIs where possible.
- Treat offline behavior and data backup as first-class requirements.
- Prefer accessible, touch-friendly controls.
- Make destructive actions explicit and reversible where practical.
- Keep import/export formats stable and documented when introduced.
