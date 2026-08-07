import type { ReactNode } from 'react'
import type { CoreValuesSection } from '@/types/home'
import Reveal from '@/components/ui/Reveal'
import RichText from '@/components/ui/RichText'

interface CoreValuesProps {
  section: CoreValuesSection
}

/** One icon per value (the API `image` is null). White over the brand tile. */
const VALUE_ICONS: ReactNode[] = [
  // Target — Accountability
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></svg>,
  // Eye — Respect
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  // Compass — Continuous Improvement
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>,
]

export default function CoreValues({ section }: CoreValuesProps) {
  const { header, values } = section

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container flex flex-col items-center gap-12 px-4 sm:px-6 lg:gap-16 lg:px-8">
        {/* Heading */}
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {header.title}
          </h2>
        </Reveal>

        {/* Value cards */}
        <div className="grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <Reveal
              key={value.id}
              delay={i * 120}
              className="flex h-full flex-col rounded-2xl border-2 border-[rgba(117,126,150,0.1)] bg-white p-7 sm:p-8"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-brand text-white">
                <span className="size-5 [&_svg]:size-full">
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </span>
              </div>
              <h3 className="pt-4 text-lg font-medium tracking-tight text-brand">
                {value.title}
              </h3>
              <RichText
                className="pt-2 text-sm leading-relaxed text-[#191919]"
                html={value.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
