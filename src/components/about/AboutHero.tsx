import type { AboutUsBlock } from '../../types/about'
import Reveal from '../ui/Reveal'
import CountUp from '../ui/CountUp'
import RichText from '../ui/RichText'

interface AboutHeroProps {
  about: AboutUsBlock
}

export default function AboutHero({ about }: AboutHeroProps) {
  const images = about.images.slice(0, 6)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-brand/15 blur-3xl"
      />
      <div className="relative mx-auto container grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <Reveal direction="right" className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            {about.title}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {about.caption}
          </h1>
          {about.description && (
            <RichText
              className="mt-6 text-lg leading-relaxed text-navy/70"
              html={about.description}
            />
          )}

          {about.statistics.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
              {about.statistics.map((stat) => (
                <div key={stat.id} className="flex flex-col gap-1">
                  <CountUp
                    value={stat.number}
                    className="text-4xl font-bold text-brand"
                  />
                  <span className="text-sm text-navy/60">{stat.name}</span>
                </div>
              ))}
            </div>
          )}
        </Reveal>

        {/* Image collage */}
        {images.length > 0 && (
          <Reveal direction="left" delay={120} className="grid grid-cols-2 gap-3 sm:gap-4">
            {images.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl bg-slate-100 ${
                  i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
