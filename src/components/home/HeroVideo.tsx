import { useState } from 'react'
import { ambientEmbedUrl, type VideoSource } from '../../lib/video'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface HeroVideoProps {
  /** Resolved source, or null when nothing playable was configured. */
  source: VideoSource | null
  /** Uploaded poster image; falls back to the YouTube still when absent. */
  poster?: string | null
  title?: string
  /** "hero" = full-bleed section player, "card" = compact carousel thumbnail. */
  variant?: 'hero' | 'card'
  /**
   * Play on its own — muted, looping, no controls. Visitors who ask for
   * reduced motion get the click-to-play poster instead.
   */
  ambient?: boolean
}

/** Per-variant chrome: button size, icon size, and how the still is dimmed. */
const VARIANTS = {
  hero: {
    // The panel is only ~260px tall on a phone, so the button scales with it.
    button: 'size-20 sm:size-28',
    icon: 'size-7 sm:size-9',
    still: 'size-full object-cover',
    scrim: 'bg-black/30',
  },
  card: {
    button: 'size-14',
    icon: 'size-5',
    still: 'size-full object-cover opacity-60',
    scrim: '',
  },
} as const

function PlayIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-white`} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

/**
 * Poster + play button that hands off to the right player once clicked: a
 * native <video> for uploaded files, a YouTube iframe for links. The embed is
 * only mounted after the click, so YouTube's scripts never load for visitors
 * who don't press play.
 */
export default function HeroVideo({
  source,
  poster,
  title = 'Video',
  variant = 'hero',
  ambient = false,
}: HeroVideoProps) {
  const [playing, setPlaying] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const chrome = VARIANTS[variant]
  const still = poster || (source?.kind === 'youtube' ? source.posterUrl : null)
  const autoplay = ambient && !reducedMotion && !!source

  if (autoplay && source?.kind === 'file') {
    return (
      <video
        src={source.src}
        poster={still ?? undefined}
        aria-label={title}
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    )
  }

  if (autoplay && source?.kind === 'youtube') {
    return (
      <iframe
        src={ambientEmbedUrl(source.id)}
        title={title}
        className="pointer-events-none absolute inset-0 size-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    )
  }

  if (playing && source?.kind === 'youtube') {
    return (
      <iframe
        src={source.embedUrl}
        title={title}
        className="size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  if (playing && source?.kind === 'file') {
    return (
      <video
        src={source.src}
        poster={still ?? undefined}
        className="size-full object-cover"
        controls
        autoPlay
        playsInline
      />
    )
  }

  return (
    <>
      {still && <img src={still} alt="" className={`absolute inset-0 ${chrome.still}`} />}
      <div
        className={`absolute inset-0 flex items-center justify-center ${chrome.scrim}`}
      >
        <button
          type="button"
          onClick={() => source && setPlaying(true)}
          aria-label={`Play ${title.toLowerCase()}`}
          disabled={!source}
          className={`flex ${chrome.button} items-center justify-center rounded-full bg-brand pl-1 shadow-lg transition-transform hover:scale-105 disabled:cursor-default disabled:hover:scale-100`}
        >
          <PlayIcon className={chrome.icon} />
        </button>
      </div>
    </>
  )
}
