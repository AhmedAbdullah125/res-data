import Link from 'next/link'
import type { ResultPageHero } from '@/types/result'
import Reveal from '@/components/ui/Reveal'
import CountUp from '@/components/ui/CountUp'
import RichText from '@/components/ui/RichText'

interface ProofStatsProps {
  hero: ResultPageHero
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

/** Colors the last word navy and the rest white (e.g. “Proof, not promises”). */
function TwoToneHeading({ title }: { title: string }) {
  const match = title.trim().match(/^(.*\s)(\S+)$/)
  if (!match) return <span className="text-white">{title}</span>

  const [, lead, last] = match
  return (
    <>
      <span className="text-white">{lead}</span>
      <span className="text-navy">{last}</span>
    </>
  )
}

export default function ProofStats({ hero }: ProofStatsProps) {
  const ctaLabel = hero.button_text_one.replace(/\s*-+>\s*$/, '').trim()

  return (
    <section className="relative overflow-hidden bg-brand">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-navy/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 size-72 rounded-full bg-[#4f8cff]/20 blur-3xl"
      />

      <div className="relative mx-auto container px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[57px]">
            <TwoToneHeading title={hero.title} />
          </h1>

          {hero.description && (
            <RichText
              className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90"
              html={hero.description}
            />
          )}

          <div className="mt-8">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-navy-light"
            >
              {ctaLabel}
              <ArrowIcon />
            </Link>
          </div>

          {hero.statistics.length > 0 && (
            <div className="mt-10 flex flex-wrap items-start gap-x-10 gap-y-6">
              {hero.statistics.map((stat) => (
                <div key={stat.id} className="flex flex-col gap-1">
                  <CountUp
                    value={stat.number}
                    className="text-3xl font-semibold text-white"
                  />
                  <span className="text-sm text-white/90">{stat.name}</span>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
