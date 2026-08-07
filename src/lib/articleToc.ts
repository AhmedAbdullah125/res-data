/** One entry in an article's table of contents. */
export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface ParsedArticle {
  /** The original HTML with a stable `id` on every h2/h3. */
  html: string
  headings: TocHeading[]
}

/** "Hit rate & you" → "hit-rate-you". */
function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

/**
 * Pulls a table of contents out of article HTML.
 *
 * Headings authored in the dashboard rarely carry ids, so we mint one per
 * h2/h3 (de-duplicated) and hand back the rewritten HTML — the TOC links and
 * the rendered body then agree by construction.
 */
export function parseArticle(html: string): ParsedArticle {
  if (typeof window === 'undefined' || !html) return { html, headings: [] }

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const headings: TocHeading[] = []
  const used = new Set<string>()

  doc.body.querySelectorAll('h2, h3').forEach((el) => {
    const text = el.textContent?.trim() ?? ''
    if (!text) return

    // Respect an id the author already set; otherwise derive one and make it
    // unique, since repeated headings would otherwise collide.
    let id = el.id || slugify(text)
    if (used.has(id)) {
      let n = 2
      while (used.has(`${id}-${n}`)) n += 1
      id = `${id}-${n}`
    }
    used.add(id)
    el.id = id

    headings.push({ id, text, level: el.tagName === 'H2' ? 2 : 3 })
  })

  return { html: doc.body.innerHTML, headings }
}

/** Rough reading estimate, used when the backend doesn't send one. */
export function estimateReadingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

/** "2026-01-14" → "January 14, 2026". Returns "" for null/invalid dates. */
export function formatPublishedDate(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
