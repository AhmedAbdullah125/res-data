import api from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { BlogDetailData, BlogsListData } from '../types/blog'

/** GET /api/landing-page/blogs — every published post, newest first. */
export async function getBlogs(signal?: AbortSignal): Promise<BlogsListData> {
  const { data } = await api.get<ApiResponse<BlogsListData>>(
    '/api/landing-page/blogs',
    { signal },
  )
  return data.data
}

/** GET /api/landing-page/blogs/{slug} — one post plus its related posts. */
export async function getBlog(
  slug: string,
  signal?: AbortSignal,
): Promise<BlogDetailData> {
  const { data } = await api.get<ApiResponse<BlogDetailData>>(
    `/api/landing-page/blogs/${encodeURIComponent(slug)}`,
    { signal },
  )
  return data.data
}
