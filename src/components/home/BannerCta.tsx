import Link from 'next/link'
import type { HomeBanner } from '@/types/home'
import Reveal from '@/components/ui/Reveal'
import RichText from '@/components/ui/RichText'

interface BannerCtaProps {
  banner: HomeBanner
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

/** Dashboard convention: the literal text "no button" means "don't render it". */
function showButton(text?: string | null) {
  const label = text?.trim() ?? ''
  return label !== '' && label.toLowerCase() !== 'no button'
}

export default function BannerCta({ banner }: BannerCtaProps) {
  const showPrimary = showButton(banner.button_one_text)
  const showSecondary = showButton(banner.button_tow_text)

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl bg-navy px-8 py-14 sm:px-14 sm:py-20">
          {/* Ambient blue glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-[#4f8cff]/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/3 size-72 rounded-full bg-[#4f8cff]/30 blur-3xl"
          />

          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {banner.title}
            </h2>
            <RichText
              className="mt-5 text-base leading-relaxed text-white/60"
              html={banner.description}
            />

            {(showPrimary || showSecondary) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {showPrimary && (
                  <Link
                    href="/get-started"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
                  >
                    {banner.button_one_text}
                    <ArrowIcon />
                  </Link>
                )}
                {showSecondary && (
                  <a
                    href="mailto:hello@res-data.com"
                    className="inline-flex items-center justify-center rounded-md border-2 border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
                  >
                    {banner.button_tow_text}
                  </a>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
