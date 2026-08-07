# Blogs — Backend & Dashboard Specification

**Status:** the front end is built and live against this contract. Nothing exists on the backend yet — every candidate route (`/api/blogs`, `/api/landing-page/blogs`, …) currently returns 404.

**Audience:** whoever implements the database, API, and dashboard CRUD (human or AI assistant). This document is the single source of truth for the payload shape. The front end already mirrors it in `src/types/blog.ts`; if you change a field name here, change it there too.

**Until this ships:** `/blogs` and `/blogs/{slug}` render three bundled fallback articles from `src/data/fallbackBlogs.ts`. The moment `GET /api/landing-page/blogs` returns a non-empty `blogs` array, the fallback disappears on its own. No front-end deploy is needed to switch over.

---

## 1. Scope

Build:

1. Four tables — posts, categories, authors, and a post↔tag pivot (or a JSON column, see §2.4).
2. Two public read endpoints, matching §3 byte for byte.
3. Dashboard CRUD for posts, categories, and authors, matching §5.

Out of scope: comments, likes, per-user personalisation, pagination (see §7).

---

## 2. Database

Follow the conventions already used by the landing-page tables: `id` bigint auto-increment, `created_at` / `updated_at` timestamps, uploads written to `storage/uploads/{entity}/` and returned as **absolute URLs** (e.g. `https://dashboard.res-va.com/storage/uploads/blog/01KY….png`), exactly like `team_member` images do today.

### 2.1 `blog_categories`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `name` | string(120) | Display name, e.g. "Data Quality" |
| `slug` | string(140) **unique** | Lowercase kebab-case, auto-derived from `name` |
| `sort` | int, default 0 | Dashboard ordering |
| timestamps | | |

### 2.2 `blog_authors`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `name` | string(120) | e.g. "The RES-DATA Team" |
| `position` | string(120), **nullable** | Job title shown under the name |
| `image` | string, **nullable** | Avatar upload path; served absolute |
| timestamps | | |

> Reuse the existing team-members table instead **only** if authors and team members are genuinely the same people. If in doubt, keep them separate — a post's byline outlives a staff change.

### 2.3 `blogs`

| Column | Type | Notes |
|---|---|---|
| `id` | bigint PK | |
| `slug` | string(200) **unique, indexed** | The URL key. See §2.5 |
| `title` | string(200) | |
| `excerpt` | text | **Plain text**, no HTML. Card teaser + meta description fallback |
| `content` | longtext | Sanitized HTML body. See §4 |
| `image` | string, **nullable** | Cover image, absolute URL |
| `category_id` | FK → `blog_categories`, **nullable**, `onDelete('set null')` | |
| `author_id` | FK → `blog_authors`, **nullable**, `onDelete('set null')` | |
| `reading_minutes` | int, **nullable** | Computed on save: `max(1, round(words / 220))` |
| `meta_title` | string(200), **nullable** | Falls back to `title` |
| `meta_description` | string(300), **nullable** | Falls back to `excerpt` |
| `is_published` | boolean, default `false` | |
| `published_at` | timestamp, **nullable**, indexed | Set when first published. Sort key |
| `sort` | int, default 0 | Manual override for pinning |
| timestamps + `softDeletes` | | Soft-delete so a slug is never silently reused |

### 2.4 Tags

Simplest workable option: a `tags` **JSON column** on `blogs` holding an array of lowercase strings — the API returns it verbatim and the front end only ever displays it.

Use a `blog_tags` + `blog_tag_blog` pivot instead **only** if you want tag landing pages later. The API shape in §3 is identical either way, so this choice is reversible.

### 2.5 Slug rules

- Auto-generate from `title` on create: lowercase, strip accents, non-alphanumerics → `-`, collapse repeats, trim.
- Must be unique; on collision append `-2`, `-3`, …
- **Editable** in the dashboard, with a warning that changing it breaks existing links.
- Never regenerate on title edit — an existing slug is a permanent URL.

---

## 3. Public API

Both endpoints are unauthenticated and use the standard envelope already returned by every landing-page route:

```json
{ "status": true, "message": "تم استرجاع البيانات بنجاح", "data": { }, "errors": [] }
```

Only published posts are ever exposed: `is_published = true` **and** `published_at <= now()`.

### 3.1 `GET /api/landing-page/blogs`

Returns every published post, newest first (`published_at DESC`, then `sort`, then `id DESC`).

```json
{
  "status": true,
  "message": "تم استرجاع البيانات بنجاح",
  "data": {
    "header": {
      "id": 20,
      "title": "The RES-DATA Blog",
      "caption": "Field notes on real estate data.",
      "description": null,
      "button_text": null
    },
    "blogs": [
      {
        "id": 1,
        "slug": "why-motivated-seller-lists-arrive-dead",
        "title": "Why Most Motivated Seller Lists Are Already Dead on Arrival",
        "excerpt": "The list you bought this morning was assembled months ago…",
        "image": "https://dashboard.res-va.com/storage/uploads/blog/01KY….png",
        "category": { "id": 1, "name": "Data Quality", "slug": "data-quality" },
        "author": {
          "id": 1,
          "name": "The RES-DATA Team",
          "position": "Data Intelligence",
          "image": null
        },
        "published_at": "2026-01-14",
        "reading_minutes": 7,
        "tags": ["motivated sellers", "data quality"]
      }
    ]
  },
  "errors": []
}
```

Contract notes:

- **`header` is optional** — send `null` if you don't add an editable header section. The front end has its own default copy.
- `blogs` must be an **array**, never `null`. An empty array is valid and makes the front end fall back to bundled posts.
- `content` must **not** appear in the list response — it is the largest column and the list never renders it.
- `category` and `author` are **nested objects or `null`**, not ids. Do not send `category_id`.
- `tags` is always an array; use `[]`, not `null`.
- `published_at` is a date string (`YYYY-MM-DD` or full ISO-8601). Both parse.

### 3.2 `GET /api/landing-page/blogs/{slug}`

Looks up by `slug`, **not** by id. Returns 404 with `status: false` when the slug is unknown or the post is unpublished.

```json
{
  "status": true,
  "message": "تم استرجاع البيانات بنجاح",
  "data": {
    "blog": {
      "id": 1,
      "slug": "why-motivated-seller-lists-arrive-dead",
      "title": "Why Most Motivated Seller Lists Are Already Dead on Arrival",
      "excerpt": "The list you bought this morning…",
      "content": "<p>Every wholesaler has had this week…</p><h2>A list is a photograph</h2>…",
      "image": "https://dashboard.res-va.com/storage/uploads/blog/01KY….png",
      "category": { "id": 1, "name": "Data Quality", "slug": "data-quality" },
      "author": { "id": 1, "name": "The RES-DATA Team", "position": "Data Intelligence", "image": null },
      "published_at": "2026-01-14",
      "reading_minutes": 7,
      "tags": ["motivated sellers", "data quality"],
      "meta_title": "Why Most Motivated Seller Lists Are Already Dead on Arrival",
      "meta_description": "Stale records, recycled lists, and unverified phone numbers…"
    },
    "related": [ /* up to 3 BlogListItem objects — same shape as §3.1, no `content` */ ]
  },
  "errors": []
}
```

`related` selection: up to 3 published posts, same `category_id` first, newest first, **excluding the current post**. Top up from other categories if the category has fewer than 3 others. Send `[]` rather than `null` when there are none.

---

## 4. Article HTML — requirements that affect the table of contents

The article body renders as HTML, and **the front end builds the table of contents by scanning `content` for `<h2>` and `<h3>` elements**. This has consequences the editor must respect:

1. **Section headings must be real `<h2>` / `<h3>` tags.** A bolded paragraph produces no TOC entry. Configure the rich-text editor to expose Heading 2 and Heading 3 and to emit real tags.
2. **`<h1>` is reserved** for the post title, which the page renders itself. An `<h1>` in the body is ignored by the TOC and will look wrong.
3. Heading `id` attributes are **optional**. The front end mints stable, de-duplicated slugs (`"Hit rate & you"` → `hit-rate-you`) and rewrites the HTML before rendering. If you do emit ids they are respected.
4. Supported and styled by the front end: `p`, `h2`, `h3`, `ul`, `ol`, `li`, `strong`, `em`, `a`, `blockquote`, `img`, `code`, `table`/`th`/`td`. Anything else renders unstyled.

**Sanitize `content` server-side on save** — strip `<script>`, `<iframe>`, `on*` handlers, `style` attributes, and `javascript:` URLs. The front end renders this HTML directly via `dangerouslySetInnerHTML`, so the backend is the only sanitization boundary. Do not rely on the editor's client-side filtering.

Images inside `content` must be uploaded to storage and referenced by absolute URL — no base64 data URIs (they bloat the payload and break caching).

---

## 5. Dashboard requirements

### 5.1 Posts

List view: cover thumbnail, title, category, author, published date, published/draft badge. Filter by category and status; search by title and slug.

Editor form:

| Field | Control | Validation |
|---|---|---|
| Title | text | required, max 200 |
| Slug | text, auto-filled from title, editable | required, unique, kebab-case, max 200 |
| Excerpt | textarea, plain text, ~200 char counter | required, max 300 |
| Content | rich text with H2/H3 in the toolbar (§4) | required |
| Cover image | upload, ~1200×630 recommended | optional, jpg/png/webp, max 4 MB |
| Category | select | optional |
| Author | select | optional |
| Tags | tag input, free text | optional |
| Meta title | text | optional, max 200 |
| Meta description | textarea | optional, max 300 |
| Published | toggle | — |
| Publish date | datetime | required when published |

Behaviour:

- `reading_minutes` is **computed on save**, not entered by hand.
- Toggling *Published* on for the first time sets `published_at` to now if empty.
- Unpublishing keeps `published_at` — republishing must not reshuffle the ordering.
- Deleting soft-deletes.
- Show a preview link to `https://res-data.com/blogs/{slug}`.

### 5.2 Categories and authors

Plain CRUD. Categories: name, slug (auto), sort. Authors: name, position, avatar upload.

Deleting a category or author that is in use must **not** delete its posts — null the foreign key (the API already handles `null`).

---

## 6. Seed data

Seed the three articles in `src/data/fallbackBlogs.ts` so the dashboard is not empty on first login. Each one has a title, slug, excerpt, HTML content with proper `<h2>`/`<h3>` structure, tags, and a category — copy them across directly. Categories to create: **Data Quality**, **Targeting**, **Operations**. One author: **The RES-DATA Team** / *Data Intelligence*.

---

## 7. Deliberately deferred

- **Pagination.** The list endpoint returns everything. Revisit past ~50 posts; adding `?page=` later is additive and won't break the current front end.
- **Tag landing pages.** Tags display only.
- **Search.** Client-side category filtering only for now.
- **Draft preview links.** Unpublished posts are not reachable via the public API at all.

---

## 8. Acceptance checklist

- [ ] `GET /api/landing-page/blogs` returns `data.blogs` as an array, newest first, with no `content` field.
- [ ] `GET /api/landing-page/blogs/{unknown-slug}` returns HTTP 404 with `status: false`.
- [ ] Unpublished and future-dated posts appear in **neither** endpoint.
- [ ] `category` and `author` are nested objects or `null` — never bare ids.
- [ ] `tags` and `related` are `[]` when empty, never `null`.
- [ ] Every image URL is absolute and loads in a browser.
- [ ] `content` contains real `<h2>`/`<h3>` tags and survives a `<script>` injection attempt on save.
- [ ] Slug is unique, stable across title edits, and editable with a warning.
- [ ] Deleting a category leaves its posts intact with `category: null`.
- [ ] With at least one published post, `https://res-data.com/blogs` shows API content instead of the bundled fallbacks.
