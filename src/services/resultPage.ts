import api from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { ResultPageData } from '../types/result'

/** GET /api/landing-page/result-page — returns the full results-page payload. */
export async function getResultPage(signal?: AbortSignal): Promise<ResultPageData> {
  const { data } = await api.get<ApiResponse<ResultPageData>>(
    '/api/landing-page/result-page',
    { signal },
  )
  return data.data
}
