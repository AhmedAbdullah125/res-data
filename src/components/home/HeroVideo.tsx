import { useState } from 'react'
import type { VideoSource } from '../../lib/video'

interface HeroVideoProps {
  /** Resolved source, or null when nothing playable was configured. */
  source: VideoSource | null
  /** Uploaded poster image; falls back to the YouTube still when absent. */
  poster?: string | null
  title?: string
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-9 fill-white" aria-hidden="true">
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
export default function HeroVideo({ source, poster, title = 'Video' }: HeroVideoProps) {
  const [playing, setPlaying] = useState(false)

  const still = poster || (source?.kind === 'youtube' ? source.posterUrl : null)

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
      {still && <img src={still} alt="" className="size-full object-cover" />}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <button
          type="button"
          onClick={() => source && setPlaying(true)}
          aria-label={`Play ${title.toLowerCase()}`}
          disabled={!source}
          className="flex size-28 items-center justify-center rounded-full bg-brand pl-1 shadow-lg transition-transform hover:scale-105 disabled:cursor-default disabled:hover:scale-100"
        >
          <PlayIcon />
        </button>
      </div>
    </>
  )
}
