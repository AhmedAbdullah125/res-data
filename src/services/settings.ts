import api from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { SiteSettings } from '@/types/settings'

/**
 * Site settings never change between routes, so the in-flight promise is
 * cached: the navbar and footer share one browser request.
 */
let cached: Promise<SiteSettings> | null = null

/**
 * Uncached request. Server Components must use this: the module-level promise
 * below lives for the whole server process, so it would pin one response for
 * every visitor until the next deploy.
 */
export async function fetchSettings(): Promise<SiteSettings> {
  const { data } = await api.get<ApiResponse<SiteSettings>>(
    '/api/landing-page/settings',
  )
  return data.data
}

/** GET /api/landing-page/settings — logo, copy and social links. */
export function getSettings(): Promise<SiteSettings> {
  cached ??= api
    .get<ApiResponse<SiteSettings>>('/api/landing-page/settings')
    .then(({ data }) => data.data)
    .catch((err) => {
      // Let the next caller retry instead of caching the failure forever.
      cached = null
      throw err
    })
  return cached
}
