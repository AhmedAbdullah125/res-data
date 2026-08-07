import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { HottestDataSection } from '../../types/home'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'

interface HottestDataProps {
  section: HottestDataSection
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

/**
 * Card icons in design order (the API `image` is null). White strokes over the
 * brand-blue tile. Order matches the four `cards`.
 */
const CARD_ICONS: ReactNode[] = [
  // Layers — "Deduplicated Data"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="m2 12 10 5 10-5" />
    <path d="m2 17 10 5 10-5" />
  </svg>,
  // Refresh — "Updated Daily"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M8 16H3v5" />
  </svg>,
  // Search — "For Your Market"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>,
  // Headset — "With Meticulous Support"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
    <path d="M21 15v2a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
    <path d="M3 15v2a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2Z" />
    <path d="M18 19a3 3 0 0 1-3 3h-3" />
  </svg>,
]

export default function HottestData({ section }: HottestDataProps) {
  const { header, cards } = section

  return (
    <section id="hottest-data" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container flex flex-col items-center gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
        {/* Heading */}
        <Reveal>
          <h2 className="max-w-3xl text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {header.title}
          </h2>
        </Reveal>

        {/* 2×2 card grid */}
        <div className="grid w-full max-w-6xl gap-5 sm:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal
              key={card.id}
              delay={(i % 2) * 120}
              className="flex h-full flex-col rounded-2xl border-2 border-slate-900/10 bg-white p-7 sm:p-8"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand text-white">
                <span className="size-5 [&_svg]:size-full">
                  {CARD_ICONS[i] ?? CARD_ICONS[0]}
                </span>
              </div>
              <h3 className="pt-5 text-2xl font-medium tracking-tight text-brand sm:text-3xl">
                {card.title}
              </h3>
              <RichText
                className="pt-3 text-sm leading-relaxed text-[#5b6577]"
                html={card.description}
              />
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        {header.button_text && (
          <Reveal>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
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
