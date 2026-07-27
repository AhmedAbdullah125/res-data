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

/**
 * Alternating timeline: a vertical rail with a dot per step, copy on one side
 * and the step's illustration on the other, flipping sides every step. Below
 * `lg` the rail moves to the left gutter and each step stacks (copy → image).
 */
export default function WhatWrong({ section }: WhatWrongProps) {
  const { header, items } = section

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {header.title}
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-6xl sm:mt-20">
          {/* Timeline rail — left gutter on small screens, centered from lg up */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-[7px] w-px bg-brand/50 lg:left-1/2 lg:-translate-x-1/2"
          />

          <ol className="flex flex-col gap-14 sm:gap-20">
            {items.map((item, i) => {
              const { number, label } = splitNumber(item.title)
              /** Steps 01, 03, 05… keep their copy on the right, image on the left. */
              const copyRight = i % 2 === 0

              return (
                <li
                  key={item.id}
                  className="relative pl-10 sm:pl-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:pl-0"
                >
                  {/* Rail dot, centred on the step */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 size-4 rounded-full bg-brand ring-4 ring-white lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
                  />

                  <Reveal
                    direction={copyRight ? 'left' : 'right'}
                    className={
                      copyRight
                        ? 'lg:order-2 lg:pl-4 lg:text-left'
                        : 'lg:order-1 lg:pr-4 lg:text-right'
                    }
                  >
                    {number && (
                      <span className="block text-2xl font-bold text-brand sm:text-3xl">
                        {number}
                      </span>
                    )}
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-navy sm:text-2xl lg:text-3xl">
                      {label}
                    </h3>
                    <RichText
                      className="mt-4 text-base leading-relaxed text-navy/70"
                      html={item.description}
                    />
                  </Reveal>

                  {item.image && (
                    <Reveal
                      delay={120}
                      direction={copyRight ? 'right' : 'left'}
                      className={`mt-8 lg:mt-0 ${copyRight ? 'lg:order-1' : 'lg:order-2'}`}
                    >
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="mx-auto w-full max-w-md object-contain"
                      />
                    </Reveal>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
