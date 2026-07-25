import type { Statistic } from './api'
import type {
  HomeBanner,
  HomePopup,
  LeadsSection,
  RealMarketsSection,
} from './home'

/** Hero band of the results page (title + stats). */
export interface ResultPageHero {
  id: number
  title: string
  description: string
  button_text_one: string
  statistics: Statistic[]
}

/** Full `data` payload of GET /api/landing-page/result-page. */
export interface ResultPageData {
  popup: HomePopup
  result_page: ResultPageHero
  real_markets: RealMarketsSection
  leads: LeadsSection
  banner: HomeBanner
}
