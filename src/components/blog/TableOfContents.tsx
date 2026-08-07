'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/articleToc'

interface TableOfContentsProps {
  headings: TocHeading[]
}

/** Matches the article's `scroll-mt` so the active item flips at the right time. */
const SCROLL_OFFSET = 120

/**
 * Sticky in-article navigation. Highlights the heading currently under the
 * top of the viewport and smooth-scrolls on click.
 */
export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')

  useEffect(() => {
    if (!headings.length) return

    const onScroll = () => {
      // The active heading is the last one whose top has passed the offset;
      // an IntersectionObserver would flap on short sections.
      let current = headings[0].id
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET) {
          current = heading.id
        }
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [headings])

  if (!headings.length) return null

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav aria-label="Table of contents" className="rounded-2xl bg-[#f3f5f8] p-6">
      <h2 className="text-xs font-bold uppercase tracking-wider text-navy/50">
        On this page
      </h2>
      <ul className="mt-4 space-y-1">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <button
                type="button"
                onClick={() => jumpTo(heading.id)}
                aria-current={active ? 'location' : undefined}
                className={`block w-full cursor-pointer border-l-2 py-1.5 text-left text-sm leading-snug transition-colors ${
                  heading.level === 3 ? 'pl-6' : 'pl-3'
                } ${
                  active
                    ? 'border-brand font-medium text-brand'
                    : 'border-slate-200 text-navy/60 hover:border-slate-300 hover:text-navy'
                }`}
              >
                {heading.text}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
