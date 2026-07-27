import api from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { SiteSettings } from '../types/settings'

/**
 * Site settings never change between routes, so the in-flight promise is
 * cached: the navbar, footer and document head all share one request.
 */
let cached: Promise<SiteSettings> | null = null

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
