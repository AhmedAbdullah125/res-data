import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FaqsSection } from '../../types/home'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'

interface FaqsProps {
  section: FaqsSection
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

/** Circle with a “+” that collapses to a “−” when open. */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500">
      <span className="absolute h-0.5 w-3 rounded bg-current" />
      <span
        className={`absolute h-3 w-0.5 rounded bg-current transition-transform duration-300 ${
          open ? 'scale-y-0' : 'scale-y-100'
        }`}
      />
    </span>
  )
}

export default function Faqs({ section }: FaqsProps) {
  const { header, faqs } = section
  const [openIds, setOpenIds] = useState<number[]>(() =>
    faqs[0] ? [faqs[0].id] : [],
  )

  const toggle = (id: number) =>
    setOpenIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    )

  return (
    <section id="faqs" className="relative scroll-mt-24 overflow-hidden bg-[#f3f5f8] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            {header.title}
          </h2>
        </Reveal>

        {/* Accordion */}
        <div className="flex w-full flex-col gap-4">
          {faqs.map((faq, i) => {
            const open = openIds.includes(faq.id)
            return (
              <Reveal
                key={faq.id}
                delay={Math.min(i, 5) * 60}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-medium text-brand">
                      {faq.question}
                    </span>
                    <ToggleIcon open={open} />
                  </button>
                </h3>

                {/* Animated collapse via grid-rows 0fr → 1fr */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <RichText
                      className="px-6 pb-5 text-sm leading-relaxed text-slate-500"
                      html={faq.answer}
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
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
