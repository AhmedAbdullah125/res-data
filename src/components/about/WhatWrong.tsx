import type { WhatWrongSection } from '../../types/about'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'

interface WhatWrongProps {
  section: WhatWrongSection
}

/** Splits "01 The Volume Trap" → { number: "01", label: "The Volume Trap" }. */
function splitNumber(title: string) {
  const match = title.match(/^(\d+)\s*(.*)$/)
  return match ? { number: match[1], label: match[2] } : { number: '', label: title }
}

export default function WhatWrong({ section }: WhatWrongProps) {
  const { header, items } = section

  return (
    <section className="relative overflow-hidden bg-[#f3f5f8] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-4xl">
            {header.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-5">
          {items.map((item, i) => {
            const { number, label } = splitNumber(item.title)
            return (
              <Reveal
                key={item.id}
                delay={Math.min(i, 5) * 90}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:gap-6 sm:p-8"
              >
                {number && (
                  <span className="shrink-0 text-3xl font-bold text-brand sm:text-4xl">
                    {number}
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-navy">{label}</h3>
                  <RichText
                    className="mt-2 text-sm leading-relaxed text-navy/70"
                    html={item.description}
                  />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
