import Link from 'next/link'
import type { MarketAnalysisSection } from '@/types/home'
import Reveal from '@/components/ui/Reveal'
import RichText from '@/components/ui/RichText'

interface MarketAnalysisProps {
  section: MarketAnalysisSection
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

export default function MarketAnalysis({ section }: MarketAnalysisProps) {
  const { header, items } = section

  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container flex flex-col items-center gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="flex max-w-4xl flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.25]">
            {header.title}
          </h2>
          {header.caption && (
            <p className="text-lg text-slate-600 sm:text-xl">{header.caption}</p>
          )}
        </Reveal>

        {/* Stepper */}
        <div className="grid w-full max-w-6xl gap-y-10 lg:grid-cols-3 lg:gap-y-0">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 120} className="relative flex flex-col">
              {/* Circle centered in the column + connector line to the next */}
              <div className="relative flex justify-center">
                {i < items.length - 1 && (
                  <div className="absolute left-1/2 top-4 hidden h-2 w-full bg-brand lg:block" />
                )}
                <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-brand text-base font-medium text-white">
                  {item.step_number}
                </div>
              </div>

              <p className="pt-4 text-center text-sm font-medium text-brand">{item.subtitle}</p>
              <h3 className="pt-6 text-center text-xl font-bold text-slate-900">{item.title}</h3>
              <RichText
                className="max-w-[260px] self-center pt-3 text-center text-sm leading-relaxed text-slate-600"
                html={item.description}
              />
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        {header.button_text && (
          <Reveal>
            <Link
              href="/get-started"
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
