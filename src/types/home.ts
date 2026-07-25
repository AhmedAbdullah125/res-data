import type { SectionHeader, Statistic } from './api'

/* ---------------------------------------------------------------------------
   Types for GET /api/landing-page/home
   One interface per top-level key in `data`, composed into HomePageData.
--------------------------------------------------------------------------- */

export interface HomePopup {
  id: number
  title: string
  description: string
  button_text_one: string
  button_text_two: string
}

export interface HomeHero {
  id: number
  title: string
  caption: string
  /** HTML string — render with care (e.g. sanitized dangerouslySetInnerHTML). */
  description: string
  button_text_one: string
  image: string
  video: string
  statistics: Statistic[]
}

export interface MotivatedSellerBody {
  id: number
  description: string
  image: string | null
}

export interface MotivatedSellerSection {
  header_1: SectionHeader
  motivated_seller: MotivatedSellerBody
  header_2: SectionHeader
}

export interface WarningPattern {
  id: number
  title: string
  image: string | null
}

export interface WarningPatternsSection {
  header: SectionHeader
  patterns: WarningPattern[]
}

export interface HottestDataCard {
  id: number
  title: string
  description: string
  image: string | null
}

export interface HottestDataSection {
  header: SectionHeader
  cards: HottestDataCard[]
}

export interface Testimonial {
  id: number
  name: string
  caption: string
  description: string
  image: string | null
  rate: number
}

export interface TestimonialsSection {
  header: SectionHeader
  testimonials: Testimonial[]
}

export interface MarketAnalysisItem {
  id: number
  step_number: string
  subtitle: string
  title: string
  description: string
}

export interface MarketAnalysisSection {
  header: SectionHeader
  items: MarketAnalysisItem[]
}

export interface RealMarket {
  id: number
  image: string | null
  title: string
  description: string
  details: string
  stats: Statistic[]
}

export interface RealMarketsSection {
  header: SectionHeader
  markets: RealMarket[]
}

export interface TeamMember {
  id: number
  image: string | null
  name: string
  position: string
  description: string
}

export interface TeamMembersSection {
  header: SectionHeader
  members: TeamMember[]
}

export interface CategoryPoint {
  id: number
  description: string
}

export interface CategoryItem {
  id: number
  title: string
  image: string | null
  /** Only present on comparison rows that carry point lists. */
  res_datas?: CategoryPoint[]
  typical_providers?: CategoryPoint[]
}

export interface CategorySection {
  header: SectionHeader
  items: CategoryItem[]
}

export interface CoreValue {
  id: number
  image: string | null
  title: string
  description: string
}

export interface CoreValuesSection {
  header: SectionHeader
  values: CoreValue[]
}

export interface Lead {
  id: number
  title: string
  description: string
  image: string | null
  video: string | null
}

export interface LeadsSection {
  header: SectionHeader
  leads: Lead[]
}

export interface Faq {
  id: number
  question: string
  answer: string
}

export interface FaqsSection {
  header: SectionHeader
  faqs: Faq[]
}

export interface HomeBanner {
  id: number
  title: string
  description: string
  button_one_text: string
  /** Note: backend spells this "tow" (typo carried through intentionally). */
  button_tow_text: string
}

/** Full `data` payload of GET /api/landing-page/home. */
export interface HomePageData {
  popup: HomePopup
  hero: HomeHero
  motivated_seller: MotivatedSellerSection
  warning_patterns: WarningPatternsSection
  hottes_data: HottestDataSection
  testimonials: TestimonialsSection
  market_analysis: MarketAnalysisSection
  real_markets: RealMarketsSection
  team_members: TeamMembersSection
  category: CategorySection
  over_values: CoreValuesSection
  leads: LeadsSection
  faqs: FaqsSection
  banner: HomeBanner
}
