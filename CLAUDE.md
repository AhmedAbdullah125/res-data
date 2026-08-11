# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # next dev
npm run build    # runs TypeScript before building — this is the typecheck
npm run start    # serve the production build
npm run lint     # oxlint
```

There is no test framework and no test files. `npm run build` (or `npx tsc --noEmit`) is the only automated verification available, so use it after any change.

`tsconfig.json` has `strict: false` but `noUnusedLocals`/`noUnusedParameters` **on** — an unused import or variable fails the build. This matters when commenting code out rather than deleting it (see below): comment the import too.

`npx tsc --noEmit` writes an untracked `tsconfig.tsbuildinfo` at the repo root; delete it afterwards.

## The README is stale

`README.md` describes the pre-migration Vite + react-router layout (`src/pages/`, `App.tsx`, `src/index.css`, `npm run preview`). None of that exists. Only its **Brand** and **API** sections still hold. Trust the code over the README.

## Architecture

Next.js 16 App Router + React 19 + TypeScript + Tailwind v4, deployed on Vercel. Alias `@/*` → `src/*`.

### Everything is CMS content

Practically all page copy, images, and video come from a dashboard backend (`NEXT_PUBLIC_API_BASE_URL`, default `https://dashboard.res-va.com`). The env var is the **host root only** — service modules append the full `/api/landing-page/...` path.

The data path is fixed and worth following exactly:

1. `src/lib/api.ts` — the single axios instance. Shared by Server Components and the browser; the auth-token interceptor is `window`-guarded because of that.
2. `src/services/*.ts` — one module per backend area, one exported function per endpoint. Each unwraps the `ApiResponse<T>` envelope (`src/types/api.ts`) and returns `data.data`, so callers never see the envelope.
3. `src/types/*.ts` — hand-written mirrors of the backend response shapes.

Content pages are async Server Components that call a service directly and set `export const dynamic = 'force-dynamic'` — content changes in the dashboard must appear without a redeploy, and the build must not depend on the backend being up.

**`getSettings()` vs `fetchSettings()`** (`src/services/settings.ts`) is a real trap. `getSettings()` caches the promise at module scope, which in a Server Component would pin one visitor's response for the entire server process. Server Components must use `fetchSettings()`; the browser (`useSettings`) uses `getSettings()` so navbar and footer share one request.

### Never render empty

A backend outage must degrade, not blank the page. The established mechanisms:

- `useSettings()` returns `null` until/unless settings arrive, so **every consumer keeps a hard-coded fallback** (site name, logo, links).
- The home page guards each section with `!!data.x?.y?.length` — sections the dashboard hasn't filled simply don't render.
- Blogs resolve through `src/lib/blogSource.ts`, which serves the bundled posts in `src/data/fallbackBlogs.ts` when the API fails *or* returns an empty list. Once real posts exist the fallbacks stop being used on their own.
- `src/mocks/home.ts` holds stand-ins for home-page fields the backend hasn't shipped yet; each is used only when the API omits the real field. Delete the file when those endpoints land.

### Routing

`src/app/(with-splash)/` is a route group whose `loading.tsx` streams the `Splash` component. `/blogs/[slug]` sits **outside** that group deliberately: a Suspense boundary above it would flush the shell before `notFound()` runs, turning a missing article into a soft 404 (HTTP 200). Don't move it in.

### Lead form (`src/components/form/`)

A three-step booking wizard whose session is scoped by an `X-Visitor-Id` header read from `localStorage` (`src/services/form.ts`). That header is why `/get-started` fetches client-side: rendering it on the server would mint a fresh visitor per request and break the flow. Wizard progress is also persisted to `localStorage` so a visitor can resume.

`useLeadForm` + `WizardBody` hold the logic and are shared by two shells — `LeadWizard` (full page) and `LeadFormModal` (the home-page popup, fired on a timer by `HomePopup`). `services/form.ts` also exposes prefetch/cache helpers so a step's questions or availability are warm before its UI mounts.

The client has since supplied a HubSpot embed (`HubSpotForm` / `HubSpotFormModal`), which currently serves both `/get-started` and the home popup while the in-house wizard stays commented out pending sign-off. The HubSpot script only scans for `.hs-form-frame` when it executes, so `HubSpotForm` re-injects it on mount — without that, a client-side navigation leaves the frame empty.

**The HubSpot form cannot be styled from this codebase.** It renders in a cross-origin iframe, and the legacy inline embed that would be styleable is rejected for this form (`403 "Not an Embed version 2 or 3 form"` — it was authored in HubSpot's new editor). Only the wrapper is ours; fonts, fields and buttons must be set in the HubSpot form editor. Don't spend time hunting for a CSS route.

### Rendering backend content

- `SmartImage` (`src/components/ui/`) uses `next/image` only for hosts listed in `next.config.ts` `remotePatterns` and falls back to a plain `<img>` for anything else, because `next/image` throws at runtime on an undeclared host and the dashboard could switch to a CDN without a frontend deploy. **Adding an upload host means editing `next.config.ts`** — otherwise images silently lose optimization.
- `RichText` renders backend HTML fragments; article bodies use the `.blog-prose` rules in `src/app/globals.css`, since that HTML isn't ours to add utility classes to.

### Styling

Tailwind v4 with **no `tailwind.config`** — brand tokens live in `@theme` in `src/app/globals.css` (`brand`, `brand-dark`, `brand-light`, `navy`, `navy-light`). Roboto is loaded via `next/font/google` in the root layout and wired to `--font-sans`.

## Conventions

- **Comment out, don't delete**, when replacing a feature that may be reverted — the codebase does this deliberately (see the HubSpot swap) and comments say why the old path is kept.
- Comments in this codebase explain *why*, especially where the non-obvious choice was forced by something (SSR, a 404 semantic, a header, a runtime throw). Match that; don't narrate what the code already says.
- `.mcp.json` configures a Figma dev-mode MCP server at `http://127.0.0.1:3845/mcp` — available only when the Figma desktop app is running locally.
