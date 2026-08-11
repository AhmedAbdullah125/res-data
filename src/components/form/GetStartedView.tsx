'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { getFormLanding } from '@/services/form'
import type { FormLandingData, FormIntroHeader } from '@/types/form'
import { resolveVideoSource } from '@/lib/video'
import Reveal from '@/components/ui/Reveal'
import RichText from '@/components/ui/RichText'
// import LeadWizard from '@/components/form/LeadWizard' // replaced by the HubSpot embed — kept for rollback
import HubSpotForm from '@/components/form/HubSpotForm'
import HeroVideo from '@/components/home/HeroVideo'
import LeadsLove from '@/components/home/LeadsLove'
import Testimonials from '@/components/home/Testimonials'

const FALLBACK_HEADER: FormIntroHeader = {
  title: '15 minutes that change how you source deals.',
  caption: '15 min · Video call',
  description: 'No commitment, no pressure',
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 text-slate-400" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 text-slate-400" fill="none" aria-hidden="true">
      <path d="M8 2 3 4v4c0 3 2.2 5 5 6 2.8-1 5-3 5-6V4L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="m6 8 1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function GetStartedView() {
  const [data, setData] = useState<FormLandingData | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    getFormLanding(controller.signal)
      .then(setData)
      .catch((err) => {
        if (!axios.isCancel(err)) setData(null)
      })
    return () => controller.abort()
  }, [])

  const header = data?.header1 ?? FALLBACK_HEADER
  const hero = data?.hero
  // The video plays by itself (muted, looping). Poster alone is enough to
  // render the panel; with no video at all it stays a still image.
  const heroSource = hero ? resolveVideoSource(hero) : null
  const hasHeroMedia = Boolean(hero?.image || heroSource)

  return (
    <>
      {/* Booking */}
      <section className="bg-sky-50 py-16 sm:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              {header.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-slate-600">
              <span className="flex items-center gap-2">
                <ClockIcon />
                {header.caption}
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheckIcon />
                <RichText as="span" html={header.description} />
              </span>
            </div>
          </Reveal>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Hero media from the dashboard; placeholder art until it's set.
                Real media shows on every breakpoint, the placeholder only on
                desktop where it isn't pushing the wizard down. */}
            <Reveal
              direction="right"
              className={`lg:sticky lg:top-28 ${hasHeroMedia ? '' : 'hidden lg:block'}`}
            >
              <div
                className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl ${
                  hasHeroMedia
                    ? 'bg-navy'
                    : 'flex items-center justify-center bg-gradient-to-br from-sky-200 via-sky-100 to-brand/30'
                }`}
              >
                {hasHeroMedia ? (
                  <HeroVideo
                    ambient
                    source={heroSource}
                    poster={hero?.image}
                    title="RES-DATA intro video"
                  />
                ) : (
                  <svg viewBox="0 0 64 64" className="size-24 text-brand/60" fill="none" aria-hidden="true">
                    <rect x="6" y="16" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="3" />
                    <path d="M46 24l12-6v28l-12-6" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </Reveal>

            {/* Booking form — HubSpot embed (client-supplied, portal 24452375).
                The in-house wizard below is kept, commented out, until the
                HubSpot form is signed off. */}
            <Reveal direction="left" delay={100}>
              {/* <LeadWizard /> */}
              {/* Card copied from LeadWizard so the swap doesn't change the
                  page's shape. Everything inside the frame is HubSpot's — see
                  the styling note in HubSpotForm. */}
              <HubSpotForm className="rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Social proof */}
      {data && (
        <>
        {
          data.leads?.length > 0 &&
          <LeadsLove
            variant="light"
            section={{ header: data.header2, leads: data.leads }}
          />
        }
          <Testimonials
            section={{ header: data.header3, testimonials: data.testimonials }}
          />
        </>
      )}
    </>
  )
}
