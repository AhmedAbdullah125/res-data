import api from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { AboutPageData } from '@/types/about'

/** GET /api/landing-page/about-us — returns the full about-page payload. */
export async function getAboutUs(signal?: AbortSignal): Promise<AboutPageData> {
  const { data } = await api.get<ApiResponse<AboutPageData>>(
    '/api/landing-page/about-us',
    { signal },
  )
  return data.data
}
