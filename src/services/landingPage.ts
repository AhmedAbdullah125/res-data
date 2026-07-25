import api from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { CategoryDetailData, CategoryItem, HomePageData } from '../types/home'

/** GET /api/landing-page/home — returns the full home-page `data` payload. */
export async function getHomePage(signal?: AbortSignal): Promise<HomePageData> {
  const { data } = await api.get<ApiResponse<HomePageData>>(
    '/api/landing-page/home',
    { signal },
  )
  return data.data
}

/**
 * GET /api/landing-page/category/{id} — the RES-DATA vs typical-provider
 * comparison points for a single category (paired by array index).
 */
export async function getCategory(
  id: number,
  signal?: AbortSignal,
): Promise<CategoryItem> {
  const { data } = await api.get<ApiResponse<CategoryDetailData>>(
    `/api/landing-page/category/${id}`,
    { signal },
  )
  return data.data.items
}
