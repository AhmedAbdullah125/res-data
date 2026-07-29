import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Lead, LeadsSection } from '../../types/home'
import { resolveVideoSource } from '../../lib/video'
import HeroVideo from './HeroVideo'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'

interface LeadsLoveProps {
  section: LeadsSection
  /** "brand" = blue band (home); "light" = light-grey band (form page). */
  variant?: 'brand' | 'light'
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M3.333 8h9.334M8.667 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" className="size-5" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-slate-300" aria-hidden="true">
      <path d="M7 7H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a2 2 0 0 1-2 2 1 1 0 0 0 0 2 4 4 0 0 0 4-4V8a1 1 0 0 0-1-1Zm12 0h-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v2a2 2 0 0 1-2 2 1 1 0 0 0 0 2 4 4 0 0 0 4-4V8a1 1 0 0 0-1-1Z" />
    </svg>
  )
}

/**
 * Card thumbnail that plays in place — an uploaded file or a YouTube link,
 * whichever the dashboard configured for this lead.
 */
function VideoThumb({ lead }: { lead: Lead }) {
  const source = resolveVideoSource(lead)

  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-[#131b2c]">
      <HeroVideo
        variant="card"
        source={source}
        poster={lead.image}
        title="Testimonial video"
      />
    </div>
  )
}

export default function LeadsLove({ section, variant = 'brand' }: LeadsLoveProps) {
  const { header, leads } = section
  const trackRef = useRef<HTMLDivElement>(null)
  const light = variant === 'light'

  // Scroll roughly one card-width (plus gap) per click; snap handles alignment.
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('article')
    const step = card ? card.clientWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  return (
    <section
      className={`relative overflow-hidden py-20 sm:py-24 ${light ? 'bg-[#f3f5f8]' : 'bg-brand'}`}
    >
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header + controls */}
        <div className="flex items-end justify-between gap-4">
          <Reveal className="flex max-w-3xl flex-col gap-3">
            <h2
              className={`text-3xl font-medium tracking-tight sm:text-4xl ${light ? 'text-brand' : 'text-white'}`}
            >
              {header.title}
            </h2>
            {header.description && (
              <RichText
                className={`text-lg sm:text-xl ${light ? 'text-slate-500' : 'text-[#e2e2e2]'}`}
                html={header.description}
              />
            )}
          </Reveal>

          {leads.length > 1 && (
            <div className="hidden shrink-0 gap-3 sm:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous"
                className={`flex size-11 items-center justify-center rounded-full shadow-md transition-colors ${light ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-white text-brand hover:bg-white/90'}`}
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next"
                className={`flex size-11 items-center justify-center rounded-full shadow-md transition-colors ${light ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-white text-brand hover:bg-white/90'}`}
              >
                <Chevron dir="right" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="mt-12 flex snap-x gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {leads.map((lead) => (
            <article
              key={lead.id}
              className={`w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border-2 bg-white sm:w-[380px] ${light ? 'border-slate-200' : 'border-white/10'}`}
            >
              <VideoThumb lead={lead} />
              <div className="flex flex-col gap-3 p-5">
                <QuoteIcon />
                <RichText className="text-sm leading-relaxed text-navy" html={lead.description} />
                <p className="text-xs text-brand">{lead.title}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        {header.button_text && (
          <Reveal className="mt-10 flex justify-center">
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-navy-light"
            >
              {header.button_text}
              <ArrowIcon />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
