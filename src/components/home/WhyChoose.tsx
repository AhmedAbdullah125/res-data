import type { ReactNode } from 'react'
import type { CategorySection } from '../../types/home'
import Reveal from '../ui/Reveal'

interface WhyChooseProps {
  section: CategorySection
}

/** Blue check for RES-DATA cells. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" className="fill-brand" />
      <path
        d="m6 10.5 2.5 2.5L14 7"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Muted X for typical-provider cells. */
function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" className="fill-slate-400" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** One simple icon per category row (the API doesn't provide them). */
const CATEGORY_ICONS: ReactNode[] = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="m8 12 3 3 5-6" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M4 16V4a2 2 0 0 1 2-2h10" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M20 15v2a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 1Z" /><path d="M4 15v2a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 1Z" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22V4" /><path d="M5 4h12l-2 4 2 4H5" /></svg>,
]

export default function WhyChoose({ section }: WhyChooseProps) {
  const { header, items } = section

  // Comparison values live on the first item that carries them; row labels are
  // the `title` of each item. Row i pairs items[i].title with res/typical[i].
  const values = items.find((it) => it.res_datas?.length)
  const rows = items.map((item, i) => ({
    id: item.id,
    category: item.title,
    res: values?.res_datas?.[i]?.description ?? '',
    typical: values?.typical_providers?.[i]?.description ?? '',
  }))

  const cell = 'flex items-center gap-3 px-6 py-4 text-[15px] leading-snug'

  return (
    <section className="relative overflow-hidden bg-[#f3f5f8] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl">
            {header.title}
          </h2>
          {header.caption && (
            <p className="text-[15px] text-navy">{header.caption}</p>
          )}
        </Reveal>

        {/* Desktop: three aligned columns via subgrid */}
        <Reveal
          className="mt-14 hidden grid-cols-[3fr_5fr_4fr] grid-rows-[repeat(11,auto)] gap-6 lg:grid"
          direction="up"
        >
          {/* Category sidebar */}
          <div className="row-span-[11] grid grid-rows-subgrid overflow-hidden rounded-lg bg-[#001e2c]">
            <div className="flex items-center px-6 pb-4 pt-8 text-2xl font-medium uppercase tracking-wider text-white">
              Category
            </div>
            {rows.map((row, i) => (
              <div
                key={row.id}
                className={`${cell} ${i === 0 ? 'text-white' : 'text-[rgba(226,226,226,0.7)]'}`}
              >
                <span className="size-5 shrink-0 [&_svg]:size-full">
                  {CATEGORY_ICONS[i] ?? CATEGORY_ICONS[0]}
                </span>
                {row.category}
              </div>
            ))}
          </div>

          {/* Featured RES-DATA column */}
          <div className="row-span-[11] grid grid-rows-subgrid overflow-hidden rounded-lg border-2 border-brand bg-white shadow-xl">
            <div className="flex items-center px-6 pb-4 pt-8 text-3xl font-bold tracking-tight text-brand">
              RES-DATA
            </div>
            {rows.map((row, i) => (
              <div
                key={row.id}
                className={`${cell} text-[#1b1b1b] ${i === 0 ? 'bg-brand/20' : ''}`}
              >
                <CheckIcon />
                {row.res}
              </div>
            ))}
          </div>

          {/* Typical providers column */}
          <div className="row-span-[11] grid grid-rows-subgrid overflow-hidden rounded-lg border border-slate-300 bg-white">
            <div className="flex items-center bg-slate-100 px-6 pb-4 pt-8 text-2xl font-medium text-slate-800">
              Typical Providers
            </div>
            {rows.map((row, i) => (
              <div
                key={row.id}
                className={`${cell} border-t border-slate-100 text-[#3e484f] ${i === 0 ? 'bg-brand/20' : ''}`}
              >
                <CrossIcon />
                {row.typical}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile: one card per category */}
        <div className="mt-10 space-y-4 lg:hidden">
          {rows.map((row, i) => (
            <Reveal
              key={row.id}
              delay={Math.min(i, 4) * 60}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="font-semibold text-navy">{row.category}</p>
              <div className="mt-3 flex items-start gap-2">
                <CheckIcon />
                <span className="text-sm text-[#1b1b1b]">{row.res}</span>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <CrossIcon />
                <span className="text-sm text-slate-500">{row.typical}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
