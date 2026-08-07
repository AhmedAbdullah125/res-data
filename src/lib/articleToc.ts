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

/**
 * Minimal entity decoding for TOC labels. The old DOM-based parser got this
 * free from `textContent`; the rendered HTML keeps its entities untouched.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '\u2013',
  mdash: '\u2014',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  hellip: '\u2026',
}

function decodeEntities(text: string) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match
  })
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
 *
 * Runs on both the server and the client (no DOM APIs).
 */
export function parseArticle(html: string): ParsedArticle {
  if (!html) return { html, headings: [] }

  const headings: TocHeading[] = []
  const used = new Set<string>()

  // Regex rather than DOMParser: this runs in Server Components too, where
  // there is no DOM, so the article body can be rendered and indexed on the
  // server instead of only after hydration.
  const rewritten = html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = decodeEntities(inner.replace(/<[^>]+>/g, '')).trim()
      if (!text) return match

      // Respect an id the author already set; otherwise derive one and make it
      // unique, since repeated headings would otherwise collide.
      const existing = attrs.match(/\sid=["']([^"']+)["']/i)
      let id = existing ? existing[1] : slugify(text)
      if (used.has(id)) {
        let n = 2
        while (used.has(`${id}-${n}`)) n += 1
        id = `${id}-${n}`
      }
      used.add(id)

      headings.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 })

      const cleaned = attrs.replace(/\sid=["'][^"']*["']/i, '')
      return `<${tag}${cleaned} id="${id}">${inner}</${tag}>`
    },
  )

  return { html: rewritten, headings }
}

/** Rough reading estimate, used when the backend doesn't send one. */
export function estimateReadingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

/**
 * "2026-01-14" → "January 14, 2026". Returns "" for null/invalid dates.
 *
 * Pinned to UTC: a bare date string parses as UTC midnight, so formatting in
 * the local zone would render a different day on the server than in a
 * behind-UTC browser — a hydration mismatch on every article date.
 */
export function formatPublishedDate(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
