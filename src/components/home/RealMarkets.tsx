import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RealMarket, RealMarketsSection } from '../../types/home'
import Reveal from '../ui/Reveal'

interface RealMarketsProps {
  section: RealMarketsSection
  /** "carousel" = home (1.5-slide slider); "stacked" = results (vertical). */
  layout?: 'carousel' | 'stacked'
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
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
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

/** A single case-study card (shared by the carousel and stacked layouts). */
function MarketCard({ market }: { market: RealMarket }) {
  return (
    <article className="flex h-full flex-col items-center gap-8 rounded-3xl border-2 border-[#dcdcdc] bg-white px-6 py-10 text-center sm:px-12 sm:py-11">
      {market.image && (
        <img
          src={market.image}
          alt={market.title}
          className="max-h-[200px] w-auto object-contain"
        />
      )}

      <div className="flex flex-col items-center gap-4">
        <h3 className="max-w-3xl text-xl font-medium tracking-tight text-brand sm:text-2xl lg:text-[28px]">
          {market.title}
        </h3>

        {market.description && (
          // Description may be HTML from the backend.
          <div
            className="max-w-3xl text-[15px] leading-relaxed text-[#5b6577] [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: market.description }}
          />
        )}

        {market.details && (
          // Details quote may be HTML; wrap the text in curly quotes inside <p>.
          <div
            className="max-w-3xl text-base font-medium leading-relaxed text-navy [&_p]:m-0 sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: market.details
                .replace(/^\s*<p>/, '<p>“')
                .replace(/<\/p>\s*$/, '”</p>'),
            }}
          />
        )}
      </div>

      {market.stats.length > 0 && (
        <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6 pt-2">
          {market.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center gap-1">
              <p className="text-2xl text-brand">{stat.number}</p>
              <p className="text-base text-[#5b6577]">{stat.name}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default function RealMarkets({ section, layout = 'carousel' }: RealMarketsProps) {
  const { header, markets } = section
  const count = markets.length

  // Show 1.5 cards on large screens (next card peeks); 1 card below lg.
  const [perView, setPerView] = useState(1)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setPerView(mq.matches ? 1.5 : 1)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const [index, setIndex] = useState(0)
  const slideBasis = 100 / perView
  const maxScroll = Math.max(0, count * slideBasis - 100)
  const translate = Math.min(index * slideBasis, maxScroll)
  const atStart = translate <= 0
  const atEnd = translate >= maxScroll
  const canNavigate = count > 1 && maxScroll > 0

  const go = (delta: number) =>
    setIndex((i) => Math.min(Math.max(i + delta, 0), count - 1))

  return (
    <section id="real-markets" className="relative scroll-mt-24 overflow-hidden bg-[#f3f5f8] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="flex max-w-3xl flex-col gap-3">
          <h2 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl">
            {header.title}
          </h2>
          {header.caption && (
            <p className="text-lg text-slate-600 sm:text-xl">{header.caption}</p>
          )}
        </Reveal>

        {layout === 'stacked' ? (
          /* Stacked full-width cards */
          <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-6">
            {markets.map((market, i) => (
              <Reveal key={market.id} delay={i * 120}>
                <MarketCard market={market} />
              </Reveal>
            ))}
          </div>
        ) : (
          /* Carousel */
          <div className="relative mt-12">
            {canNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={atStart}
                  aria-label="Previous"
                  className="absolute -left-2 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-opacity hover:bg-brand-dark disabled:opacity-40 sm:left-0 lg:-left-4"
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={atEnd}
                  aria-label="Next"
                  className="absolute -right-2 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-opacity hover:bg-brand-dark disabled:opacity-40 sm:right-0 lg:-right-4"
                >
                  <Chevron dir="right" />
                </button>
              </>
            )}

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${translate}%)` }}
              >
                {markets.map((market) => (
                  <div
                    key={market.id}
                    className="shrink-0 px-2 sm:px-3"
                    style={{ width: `${slideBasis}%` }}
                  >
                    <MarketCard market={market} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        {header.button_text && (
          <Reveal className="mt-12 flex justify-center">
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
