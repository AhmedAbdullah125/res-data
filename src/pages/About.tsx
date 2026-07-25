import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAboutUs } from '../services/aboutUs'
import type { AboutPageData } from '../types/about'
import Splash from '../components/ui/Splash'
import AboutHero from '../components/about/AboutHero'
import WhatWrong from '../components/about/WhatWrong'
import WhyWeDo from '../components/about/WhyWeDo'
import TeamMembers from '../components/home/TeamMembers'
import BannerCta from '../components/home/BannerCta'

export default function About() {
  const [data, setData] = useState<AboutPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getAboutUs(controller.signal)
      .then(setData)
      .catch((err) => {
        if (axios.isCancel(err)) return
        setError(err instanceof Error ? err.message : 'Failed to load about page')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  return (
    <>
      <Splash loading={loading} />

      {error && !data && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-lg font-semibold text-navy">Couldn’t load the page</p>
          <p className="text-sm text-navy/60">{error}</p>
        </div>
      )}

      {data && (
        <>
          <AboutHero about={data.about_us} />
          <WhatWrong section={data.what_wrong} />
          <WhyWeDo section={data.why_we_do} />
          <TeamMembers section={data.team_members} />
          <BannerCta banner={data.banner} />
        </>
      )}
    </>
  )
}
