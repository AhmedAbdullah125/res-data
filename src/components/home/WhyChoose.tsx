import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CategoryItem, CategorySection } from '../../types/home'
import { getCategory } from '../../services/landingPage'
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

const cell = 'flex items-center gap-3 px-6 py-4 text-[15px] leading-snug'

export default function WhyChoose({ section }: WhyChooseProps) {
  const { header, items: categories } = section

  const [selectedId, setSelectedId] = useState<number | null>(
    categories[0]?.id ?? null,
  )
  // Fetched category details, keyed by id. Seed with any category the home
  // payload already delivered inline so we don't refetch it.
  const [cache, setCache] = useState<Record<number, CategoryItem>>(() => {
    const seed: Record<number, CategoryItem> = {}
    for (const it of categories) if (it.res_datas?.length) seed[it.id] = it
    return seed
  })
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch the selected category's points on demand, once per id.
  useEffect(() => {
    if (selectedId == null || cache[selectedId]) return
    const controller = new AbortController()
    setLoadingId(selectedId)
    setError(null)
    getCategory(selectedId, controller.signal)
      .then((detail) => {
        setCache((prev) => ({ ...prev, [detail.id]: detail }))
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError('Could not load this category. Please try again.')
        console.error(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingId(null)
      })
    return () => controller.abort()
  }, [selectedId, cache])

  const detail = selectedId != null ? cache[selectedId] : undefined
  const isLoading = loadingId != null && loadingId === selectedId && !detail

  const res = detail?.res_datas ?? []
  const typical = detail?.typical_providers ?? []
  // Body row count: enough to fit the category list and the point pairs; while
  // loading we reserve a few skeleton rows so the layout doesn't collapse.
  const pointRows = Math.max(res.length, typical.length, isLoading ? 6 : 0)
  const bodyRows = Math.max(categories.length, pointRows, 1)
  const rowIndexes = Array.from({ length: bodyRows }, (_, i) => i)

  /** Shared subgrid props so all three columns keep their rows aligned. */
  const columnSpan = { gridRow: '1 / -1' as const }

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

        {error && (
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Desktop: three aligned columns via subgrid */}
        <Reveal className="mt-14 hidden lg:block" direction="up">
          <div
            className="grid grid-cols-[3fr_5fr_4fr] gap-x-6"
            style={{ gridTemplateRows: `auto repeat(${bodyRows}, auto)` }}
          >
            {/* Category sidebar */}
            <div
              className="grid grid-rows-subgrid overflow-hidden rounded-lg bg-[#001e2c]"
              style={columnSpan}
            >
              <div className="flex items-center px-6 pb-4 pt-8 text-2xl font-medium uppercase tracking-wider text-white">
                Category
              </div>
              {rowIndexes.map((i) => {
                const cat = categories[i]
                if (!cat) return <div key={i} aria-hidden="true" />
                const active = cat.id === selectedId
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedId(cat.id)}
                    aria-pressed={active}
                    className={`${cell} w-full cursor-pointer text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-[rgba(226,226,226,0.7)] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="size-5 shrink-0 [&_svg]:size-full">
                      {CATEGORY_ICONS[i] ?? CATEGORY_ICONS[0]}
                    </span>
                    {cat.title}
                  </button>
                )
              })}
            </div>

            {/* Featured RES-DATA column */}
            <div
              className="grid grid-rows-subgrid overflow-hidden rounded-lg border-2 border-brand bg-white shadow-xl"
              style={columnSpan}
            >
              <div className="flex items-center px-6 pb-4 pt-8 text-3xl font-bold tracking-tight text-brand">
                RES-DATA
              </div>
              {rowIndexes.map((i) => {
                const point = res[i]
                return (
                  <div key={i} className={`${cell} text-[#1b1b1b]`}>
                    {point ? (
                      <>
                        <CheckIcon />
                        {point.description}
                      </>
                    ) : isLoading ? (
                      <span className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200" />
                    ) : null}
                  </div>
                )
              })}
            </div>

            {/* Typical providers column */}
            <div
              className="grid grid-rows-subgrid overflow-hidden rounded-lg border border-slate-300 bg-white"
              style={columnSpan}
            >
              <div className="flex items-center bg-slate-100 px-6 pb-4 pt-8 text-2xl font-medium text-slate-800">
                Typical Providers
              </div>
              {rowIndexes.map((i) => {
                const point = typical[i]
                return (
                  <div
                    key={i}
                    className={`${cell} border-t border-slate-100 text-[#3e484f]`}
                  >
                    {point ? (
                      <>
                        <CrossIcon />
                        {point.description}
                      </>
                    ) : isLoading ? (
                      <span className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200" />
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Mobile: pick a category, then read its points */}
        <div className="mt-10 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = cat.id === selectedId
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedId(cat.id)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand text-white'
                      : 'bg-white text-navy ring-1 ring-slate-200'
                  }`}
                >
                  {cat.title}
                </button>
              )
            })}
          </div>

          <div className="mt-5 space-y-3">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-slate-200/60"
                />
              ))}
            {!isLoading &&
              res.map((point, i) => (
                <Reveal
                  key={point.id}
                  delay={Math.min(i, 4) * 60}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-sm text-[#1b1b1b]">
                      {point.description}
                    </span>
                  </div>
                  {typical[i] && (
                    <div className="mt-2 flex items-start gap-2">
                      <CrossIcon />
                      <span className="text-sm text-slate-500">
                        {typical[i].description}
                      </span>
                    </div>
                  )}
                </Reveal>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
