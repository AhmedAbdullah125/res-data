import type { Metadata } from 'next'
import { getAboutUs } from '@/services/aboutUs'
import AboutHero from '@/components/about/AboutHero'
import WhatWrong from '@/components/about/WhatWrong'
import WhyWeDo from '@/components/about/WhyWeDo'
import TeamMembers from '@/components/home/TeamMembers'
import BannerCta from '@/components/home/BannerCta'
import PoliciesLegal from '@/components/common/PoliciesLegal'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Who RES-DATA is, what we think is wrong with real estate data today, and why we build it the way we do.',
}

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const data = await getAboutUs()

  return (
    <>
      <AboutHero about={data.about_us} />
      <WhatWrong section={data.what_wrong} />
      <WhyWeDo section={data.why_we_do} />
      <TeamMembers section={data.team_members} />
      <PoliciesLegal />
      <BannerCta banner={data.banner} />
    </>
  )
}
