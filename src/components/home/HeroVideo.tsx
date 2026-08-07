'use client'

import { useEffect, useRef, useState } from 'react'
import { ambientEmbedUrl, YOUTUBE_EMBED_ORIGIN, type VideoSource } from '@/lib/video'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import SmartImage from '@/components/ui/SmartImage'

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

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path
        d="M4 9v6h3.5L12 19V5L7.5 9H4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {muted ? (
        <path
          d="m16 9.5 4 5m0-5-4 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

/** Sound toggle laid over an ambient player, which starts muted by policy. */
function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Unmute video' : 'Mute video'}
      aria-pressed={!muted}
      className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <SpeakerIcon muted={muted} />
    </button>
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
  // Ambient playback has to start muted for autoplay to be allowed; the
  // visitor can turn sound on from the overlaid button.
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  // React writes `muted` on mount but the property is what actually gates
  // audio, so keep the element in sync with our state directly.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  const chrome = VARIANTS[variant]
  const still = poster || (source?.kind === 'youtube' ? source.posterUrl : null)
  const autoplay = ambient && !reducedMotion && !!source

  /** YouTube has no DOM handle, so the embed is driven over postMessage. */
  function toggleYouTubeMute() {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: muted ? 'unMute' : 'mute', args: [] }),
      YOUTUBE_EMBED_ORIGIN,
    )
    setMuted((m) => !m)
  }

  if (autoplay && source?.kind === 'file') {
    return (
      <>
        <video
          ref={videoRef}
          src={source.src}
          poster={still ?? undefined}
          aria-label={title}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <MuteButton muted={muted} onToggle={() => setMuted((m) => !m)} />
      </>
    )
  }

  if (autoplay && source?.kind === 'youtube') {
    return (
      <>
        <iframe
          ref={iframeRef}
          src={ambientEmbedUrl(source.id)}
          title={title}
          className="pointer-events-none absolute inset-0 size-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <MuteButton muted={muted} onToggle={toggleYouTubeMute} />
      </>
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
      {still && (
        <SmartImage
          src={still}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={chrome.still}
        />
      )}
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
