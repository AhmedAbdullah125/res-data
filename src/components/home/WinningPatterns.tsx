import type { ReactNode } from 'react'
import type { WarningPatternsSection } from '../../types/home'
import Reveal from '../ui/Reveal'

interface WinningPatternsProps {
  section: WarningPatternsSection
}

/** Horizontal blue arrow between steps (points down when steps stack). */
const ARROW = '/Arrow-Vector.png'

/** Colors the leading token (e.g. `RES_DATA`) brand-blue and the rest navy. */
function TwoToneHeading({ title }: { title: string }) {
  // First word (with an optional trailing apostrophe) is brand; rest is navy.
  const match = title.match(/^(\S+)\s+(.*)$/)
  if (!match) return <span className="text-brand">{title}</span>

  const [, lead, rest] = match
  return (
    <>
      <span className="text-brand">{lead} </span>
      <span className="text-navy">{rest}</span>
    </>
  )
}

/**
 * Design icons, one per step (the API doesn't supply them). Rendered in
 * brand-blue, sized by the parent. Order matches the four `patterns`.
 */
const STEP_ICONS: ReactNode[] = [
  // Search — "We Study the Market"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>,
  // Layers — "We Find the Winning Pattern"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="m2 12 10 5 10-5" />
    <path d="m2 17 10 5 10-5" />
  </svg>,
  // Line chart — "We Predict Motivation"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m7 13 3-3 3 3 5-6" />
  </svg>,
  // Head + cog — "You Get Smarter Leads"
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 21H7.5A1.5 1.5 0 0 1 6 19.5V18H4.4a1 1 0 0 1-.9-1.45L5 13.5V11a6 6 0 0 1 6-6" />
    <circle cx="15.5" cy="11.5" r="2.5" />
    <path d="M15.5 7.5v-1M15.5 16.5v-1M19.5 11.5h1M10.5 11.5h1M18.3 8.7l.7-.7M12 15l.7-.7M18.3 14.3l.7.7M12 8l.7.7" />
  </svg>,
]

/** Splits "01 | We Study the Market" into its number and label. */
function splitPattern(title: string) {
  const [number, ...rest] = title.split(/\s*\|\s*/)
  return { number: number.trim(), label: rest.join(' | ').trim() }
}

export default function WinningPatterns({ section }: WinningPatternsProps) {
  const { header, patterns } = section

  return (
    <section className="relative overflow-hidden bg-slate-50/60 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container flex flex-col items-center gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
        {/* Header */}
        <Reveal className="flex max-w-7xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            <TwoToneHeading title={header.title} />
          </h2>
          {header.description && (
            // Description is HTML from the backend
            <div
              className="max-w-7xl text-base leading-relaxed text-[#4e4e4e] [&_p]:m-0 sm:text-lg lg:text-xl"
              dangerouslySetInnerHTML={{ __html: header.description }}
            />
          )}
        </Reveal>

        {/* Steps */}
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:gap-1">
          {patterns.map((pattern, i) => {
            const { number, label } = splitPattern(pattern.title)
            return (
              <div key={pattern.id} className="flex flex-col items-center lg:flex-row">
                <Reveal delay={i * 120} className="flex flex-col items-center">
                  <div className="flex size-[200px] flex-col items-center justify-center gap-3 rounded-full border-2 border-brand bg-[#ededed] px-4 py-6 text-center sm:size-[220px] lg:size-[240px]">
                    <span className="size-12 text-brand sm:size-14 [&_svg]:size-full">
                      {STEP_ICONS[i] ?? STEP_ICONS[0]}
                    </span>
                    <p className="text-xl font-semibold text-brand sm:text-2xl">
                      {number}&nbsp;|
                    </p>
                    <p className="max-w-[10rem] text-xl font-semibold leading-7 text-brand sm:text-2xl">
                      {label}
                    </p>
                  </div>
                </Reveal>

                {i < patterns.length - 1 && (
                  <img
                    src={ARROW}
                    alt=""
                    aria-hidden="true"
                    className="my-2 w-8 rotate-90 lg:mx-1 lg:my-0 lg:w-12 lg:rotate-0"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
