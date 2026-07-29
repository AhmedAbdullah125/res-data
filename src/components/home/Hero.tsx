import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { HomeHero } from '../../types/home'
import { useInView } from '../../hooks/useInView'
import { resolveVideoSource } from '../../lib/video'
import { MOCK_HERO_VIDEO_URL } from '../../mocks/home'
import Reveal from '../ui/Reveal'
import HeroVideo from './HeroVideo'

interface HeroProps {
  hero: HomeHero
}

/**
 * Animates the numeric part of a stat from 0 to its target when `active`,
 * preserving any prefix/suffix ("$40M+" → counts 40, keeps "$" and "M+").
 * Values with no leading number (e.g. "US Wide") render unchanged.
 */
function CountUp({ value, active }: { value: string; active: boolean }) {
  const parsed = useMemo(() => value.match(/^(\D*)(\d[\d,]*)(.*)$/), [value])
  const target = parsed ? Number(parsed[2].replace(/,/g, '')) : 0
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!parsed || !active) return
    let raf = 0
    let startTs = 0
    const duration = 1500
    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setN(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, parsed, target])

  if (!parsed) return <>{value}</>
  return (
    <>
      {parsed[1]}
      {n.toLocaleString()}
      {parsed[3]}
    </>
  )
}

/**
 * Splits the hero title on its first `"…"` quoted segment so the quoted words
 * (e.g. “Motivated Sellers”) render in navy while the rest stays brand-blue —
 * matching the Figma design without hard-coding the copy.
 */
function HeroTitle({ title }: { title: string }) {
  const match = title.match(/^(.*?)["“]([^"”]*)["”](.*)$/)
  if (!match) return <>{title}</>

  const [, pre, quoted, post] = match
  return (
    <>
      <span className="text-brand">{pre}“</span>
      <span className="text-navy">{quoted}</span>
      <span className="text-brand">”{post}</span>
    </>
  )
}

/** Five stars, the first `rate` filled amber, the rest muted grey. */
function StarRating({ rate }: { rate: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rate} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`size-4 ${i < rate ? 'fill-amber-400' : 'fill-slate-300'}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.472 5.008 5.528.803-4 3.898.944 5.506L10 14.116l-4.944 2.599.944-5.506-4-3.898 5.528-.803L10 1.5z" />
        </svg>
      ))}
    </span>
  )
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

/** Bundled fallback photos, used until `hero.trust.images` is populated. */
const FALLBACK_AVATARS = ['/c1.png', '/c2.webp', '/c3.webp', '/c4.webp']

/** Ring tints, applied by position so the stack looks the same either way. */
const AVATAR_TONES = [
  'from-sky-300 to-sky-500',
  'from-indigo-300 to-indigo-500',
  'from-rose-300 to-rose-500',
  'from-emerald-300 to-emerald-500',
]

/** Small avatar-stack used inside the social-proof pill. */
function AvatarStack({ images }: { images: string[] }) {
  return (
    <div className="flex items-center">
      {images.map((src, i) => (
        <span
          key={`${src}-${i}`}
          className={`-ml-2 size-8 rounded-full bg-gradient-to-br p-[2px] ring-2 ring-white first:ml-0 ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="size-full rounded-full bg-white object-cover"
          />
        </span>
      ))}
    </div>
  )
}

export default function Hero({ hero }: HeroProps) {
  const [statsRef, statsInView] = useInView<HTMLDivElement>()
  const firstStat = hero.statistics[0]

  // Social proof: dashboard-managed when `trust` is filled in, otherwise the
  // bundled avatars + the first statistic, exactly as before.
  const trust = hero.trust
  const avatars = trust?.images?.length ? trust.images : FALLBACK_AVATARS
  // `rate` arrives as a decimal string ("5.00"); anything unparseable → 5.
  const parsedRate = Number(trust?.rate)
  const rating = Number.isFinite(parsedRate)
    ? Math.min(5, Math.max(0, Math.round(parsedRate)))
    : 5
  const trustLabel =
    trust?.title || (firstStat ? `${firstStat.number} ${firstStat.name}` : '')

  // The API tacks a literal " ->" onto the CTA; we render a real arrow icon.
  const ctaLabel = hero.button_text_one.replace(/\s*-+>\s*$/, '').trim()

  // Uploaded file or YouTube link — whichever the dashboard configured.
  const videoSource = resolveVideoSource({
    video: hero.video || MOCK_HERO_VIDEO_URL,
    video_url: hero.video_url,
    video_type: hero.video_type,
  })

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 to-white">
      {/* Ambient blue glow, top-right (Figma GridGlow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-[333px] rounded-full bg-brand/20 blur-3xl"
      />

      <div className="relative mx-auto container px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          {/* Left — copy */}
          <Reveal direction="right" className="max-w-xl">
            {/* Social-proof pill */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <AvatarStack images={avatars} />
              <StarRating rate={rating} />
              {trustLabel && <span className="text-sm text-slate-600">{trustLabel}</span>}
            </div>

            {hero.caption && (
              <p className="mt-6 text-2xl tracking-tight text-slate-600">{hero.caption}</p>
            )}

            <h1 className="mt-4 text-base font-semibold leading-[1.12] tracking-tight sm:text-[48px]">
              <HeroTitle title={hero.title} />
            </h1>

            {/* Description is HTML from the backend */}
            <div
              className="mt-6 space-y-4 text-base lg:text-lg leading-relaxed text-[#4e4e4e] [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: hero.description }}
            />

            <div className="mt-8">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                {ctaLabel}
                <ArrowIcon />
              </Link>
            </div>
          </Reveal>

          {/* Right — video / poster */}
          <Reveal
            direction="left"
            delay={150}
            className="relative aspect-[586/503] w-full overflow-hidden rounded-[40px] bg-navy shadow-xl"
          >
            <HeroVideo source={videoSource} poster={hero.image} title="RES-DATA intro video" />
          </Reveal>
        </div>

        {/* Statistics row (Figma node 1:309) */}
        {hero.statistics.length > 0 && (
          <div
            ref={statsRef}
            className="mt-16 flex flex-wrap items-start justify-center gap-x-24 gap-y-10 sm:mt-20"
          >
            {hero.statistics.map((stat, i) => (
              <Reveal
                key={stat.id}
                delay={i * 120}
                className="flex flex-col items-center gap-3"
              >
                <p className="text-4xl font-bold text-brand">
                  <CountUp value={stat.number} active={statsInView} />
                </p>
                <p className="text-2xl text-navy">{stat.name}</p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
