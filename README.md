# RES-DATA

The data intelligence partner for serious real estate investors — marketing site + app frontend.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4**.

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL if needed
npm run dev            # start dev server
npm run build          # type-check + production build
npm run preview        # preview the production build
```

## Brand

| Token            | Value      | Tailwind utility            |
| ---------------- | ---------- | --------------------------- |
| Primary          | `#30A9DF`  | `brand` (e.g. `bg-brand`)   |
| Secondary (navy) | `#0E2245`  | `navy` (e.g. `text-navy`)   |
| Font             | Roboto     | `font-sans` (default)       |

Brand tokens are defined in [`src/index.css`](src/index.css) via Tailwind v4's `@theme`.

## API

All backend calls go through the shared axios client in [`src/lib/api.ts`](src/lib/api.ts).
Base URL is read from `VITE_API_BASE_URL` (defaults to `https://res-data.com/api/v1`).

```ts
import api from './lib/api'
const { data } = await api.get('/some-endpoint')
```

## Structure

```
public/               logo.png, footerLogo.png
src/
  components/layout/   Navbar, Footer, Layout (+ scroll-to-top)
  pages/               Home + placeholder pages per route
  lib/api.ts           axios instance (base URL + auth interceptor)
  index.css            Tailwind import + brand theme
  App.tsx              routes
```

## Routes

`/` · `/services` · `/how-it-works` · `/results` · `/about` · `/faq` · `/contact`

The navbar and footer are complete; page bodies are placeholders ready to be filled in section by section.
