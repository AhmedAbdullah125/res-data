import type { AboutUsBlock } from '../../types/about'
import Reveal from '../ui/Reveal'
import CountUp from '../ui/CountUp'
import RichText from '../ui/RichText'

interface AboutHeroProps {
  about: AboutUsBlock
}

/**
 * Fixed positions for the scattered image collage that frames the centered
 * copy. Three slots hug the left gutter, three the right; each is tilted and
 * shadowed to read as a loose "pinned photos" arrangement. The decorative
 * collage only shows from `lg` up, where there's room in the side gutters —
 * below that the copy stands on its own.
 */
const IMAGE_SLOTS = [
  'top-2 left-0 w-40 xl:w-48 aspect-[3/4] -rotate-6',
  'top-1/2 left-2 xl:-left-6 w-36 xl:w-44 aspect-square -translate-y-1/2 rotate-3',
  'bottom-2 left-6 xl:left-2 w-40 xl:w-48 aspect-[3/4] rotate-3',
  'top-2 right-0 w-40 xl:w-48 aspect-[3/4] rotate-6',
  'top-1/2 right-2 xl:-right-6 w-36 xl:w-44 aspect-[3/4] -translate-y-1/2 -rotate-3',
  'bottom-2 right-6 xl:right-2 w-44 xl:w-52 aspect-[4/3] rotate-2',
] as const

export default function AboutHero({ about }: AboutHeroProps) {
  const images = about.images.slice(0, IMAGE_SLOTS.length)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
      />

      {/* Scattered image collage (decorative, lg+ only) */}
      {images.length > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto hidden container lg:block"
        >
          {images.map((src, i) => (
            <div
              key={i}
              className={`absolute overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-black/5 ${IMAGE_SLOTS[i]}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Centered copy */}
      <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand sm:text-5xl lg:text-6xl">
          {about.title}
        </h1>
        <p className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
          {about.caption}
        </p>
        {about.description && (
          <RichText
            className="mt-6 text-lg leading-relaxed text-navy/70"
            html={about.description}
          />
        )}

        {about.statistics.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {about.statistics.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center gap-1 rounded-3xl bg-slate-50 px-12 py-8 ring-1 ring-slate-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mb-1 size-9 text-brand"
                >
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5 9.5V21h14V9.5" />
                  <path d="M10 21v-6h4v6" />
                </svg>
                <CountUp
                  value={stat.number}
                  className="text-4xl font-bold text-brand"
                />
                <span className="text-base text-navy/70">{stat.name}</span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  )
}
