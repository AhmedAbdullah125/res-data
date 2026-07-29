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

/** Social proof shown in the hero pill: client avatars + rating + label. */
export interface HeroTrust {
  id: number
  /** e.g. "300+ Clients" — replaces the first statistic when present. */
  title: string
  /** Decimal string out of 5, e.g. "5.00". */
  rate: string
  /** Avatar URLs (four when configured; can arrive empty). */
  images: string[]
}

export interface HomeHero {
  id: number
  title: string
  caption: string
  /** HTML string — render with care (e.g. sanitized dangerouslySetInnerHTML). */
  description: string
  button_text_one: string
  image: string
  /** Uploaded video file URL (used when `video_type` is "file"). */
  video: string
  /**
   * Which source the dashboard picked. Optional: the front end derives the
   * real kind from the URL, so this is only a hint about which field to read
   * first. See docs/BACKEND_CHANGES.md.
   */
  video_type?: 'file' | 'youtube' | null
  /** External video link, currently YouTube (used when `video_type` is "youtube"). */
  video_url?: string | null
  /** Absent on older payloads — the front end falls back to bundled avatars. */
  trust?: HeroTrust | null
  statistics: Statistic[]
}

/** Overlay slot a motivated-seller label snaps to. */
export type AnnotationPosition =
  | 'top-left'
  | 'middle-left'
  | 'bottom-left'
  | 'top-right'
  | 'middle-right'
  | 'bottom-right'

/** One label drawn over the unannotated property image. */
export interface MotivatedSellerAnnotation {
  id: number
  title: string
  /** Null/absent → the front end assigns slots in list order. */
  position?: AnnotationPosition | null
  sort?: number | null
}

export interface MotivatedSellerBody {
  id: number
  description: string
  /** Legacy image with the labels baked in; used when `image_free` is absent. */
  image: string | null
  /** Clean property image (no text) that the labels are drawn over. */
  image_free?: string | null
  /** Label texts the front end positions and connects with arrows. */
  annotations?: MotivatedSellerAnnotation[]
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

/** `data` payload of GET /api/landing-page/category/{id} — one category's points. */
export interface CategoryDetailData {
  items: CategoryItem
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
  /** Uploaded video file URL (used when `video_type` is "file"). */
  video: string | null
  /** Hint about which field holds the source; the URL decides the player. */
  video_type?: 'file' | 'youtube' | null
  /** External video link, currently YouTube (used when `video_type` is "youtube"). */
  video_url?: string | null
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
