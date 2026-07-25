import api from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { HomePageData } from '../types/home'

/** GET /api/landing-page/home — returns the full home-page `data` payload. */
export async function getHomePage(signal?: AbortSignal): Promise<HomePageData> {
  const { data } = await api.get<ApiResponse<HomePageData>>(
    '/api/landing-page/home',
    { signal },
  )
  return data.data
}
