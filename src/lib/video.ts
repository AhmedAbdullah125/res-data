/* ---------------------------------------------------------------------------
   Video source resolution.

   The backend can serve a section's video either as an uploaded file or as a
   YouTube link (see docs/BACKEND_CHANGES.md). Both arrive on the same payload,
   so the front end sniffs the URL instead of trusting a single field: whatever
   parses as YouTube is embedded in an iframe, anything else is played with a
   native <video> element.
--------------------------------------------------------------------------- */

export type VideoSource =
  | {
      kind: 'youtube'
      id: string
      /** Ready-to-use iframe src (autoplays, since it's behind a play button). */
      embedUrl: string
      /** YouTube-hosted still, usable as a poster when no image is uploaded. */
      posterUrl: string
    }
  | { kind: 'file'; src: string }

/** Fields any video-carrying payload may expose. */
export interface VideoFields {
  video?: string | null
  video_url?: string | null
  video_type?: string | null
}

const YOUTUBE_HOST = /(?:^|\.)(?:youtube\.com|youtube-nocookie\.com|youtu\.be)$/i

/** YouTube ids are 11 chars today, but stay lenient about the exact length. */
function validId(candidate: string | undefined | null) {
  const id = candidate?.trim()
  return id && /^[\w-]{6,20}$/.test(id) ? id : null
}

/**
 * Extracts the video id from any common YouTube URL shape — `watch?v=`,
 * `youtu.be/…`, `/embed/…`, `/shorts/…`, `/live/…` — or returns null when the
 * URL isn't YouTube at all.
 */
export function youtubeId(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url.trim())
  } catch {
    return null
  }
  if (!YOUTUBE_HOST.test(parsed.hostname)) return null

  if (parsed.hostname.replace(/^www\./, '') === 'youtu.be') {
    return validId(parsed.pathname.slice(1).split('/')[0])
  }

  const fromQuery = validId(parsed.searchParams.get('v'))
  if (fromQuery) return fromQuery

  const fromPath = parsed.pathname.match(/\/(?:embed|shorts|v|live)\/([^/?#]+)/)
  return validId(fromPath?.[1])
}

function youtubeSource(id: string): VideoSource {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  return {
    kind: 'youtube',
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?${params}`,
    posterUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  }
}

/**
 * Picks the playable source out of a payload. `video_type` (when the backend
 * sends it) only decides which field to look at first — the actual kind is
 * always derived from the URL, so a YouTube link pasted into `video` still
 * works and an uploaded file left in `video_url` does too.
 */
export function resolveVideoSource(fields: VideoFields): VideoSource | null {
  const type = fields.video_type?.trim().toLowerCase()
  const fileFirst = type === 'file' || type === 'upload' || type === 'media'
  const candidates = fileFirst
    ? [fields.video, fields.video_url]
    : [fields.video_url, fields.video]

  for (const candidate of candidates) {
    const url = candidate?.trim()
    if (!url) continue
    const id = youtubeId(url)
    return id ? youtubeSource(id) : { kind: 'file', src: url }
  }
  return null
}
