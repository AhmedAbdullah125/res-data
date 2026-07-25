import type { SectionHeader, Statistic } from './api'
import type { HomeBanner, HomePopup, TeamMembersSection } from './home'

/** Intro block of the About page. */
export interface AboutUsBlock {
  id: number
  title: string
  caption: string
  description: string
  images: string[]
  statistics: Statistic[]
}

export interface WhatWrongItem {
  id: number
  /** Number-prefixed, e.g. "01 The Volume Trap". */
  title: string
  description: string
  image: string | null
}

export interface WhatWrongSection {
  header: SectionHeader
  items: WhatWrongItem[]
}

export interface WhyWeDoItem {
  id: number
  description: string
}

export interface WhyWeDoSection {
  header: SectionHeader
  items: WhyWeDoItem[]
}

/** Full `data` payload of GET /api/landing-page/about-us. */
export interface AboutPageData {
  popup: HomePopup
  about_us: AboutUsBlock
  what_wrong: WhatWrongSection
  why_we_do: WhyWeDoSection
  team_members: TeamMembersSection
  banner: HomeBanner
}
