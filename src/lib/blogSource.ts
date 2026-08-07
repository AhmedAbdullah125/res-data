import { getBlog, getBlogs } from '@/services/blog'
import { FALLBACK_BLOGS, findFallbackBlog } from '@/data/fallbackBlogs'
import type { BlogDetail, BlogListItem } from '@/types/blog'
import type { SectionHeader } from '@/types/api'

/**
 * Blog data with the bundled-post fallback applied, usable from Server
 * Components. Replaces the old `useBlogs`/`useBlog` client hooks so the
 * article HTML is in the server-rendered response — the whole point of having
 * a blog. The fallback rules are unchanged: a failed request *or* an empty
 * list serves the bundled posts.
 */

export interface ResolvedBlogs {
  blogs: BlogListItem[]
  header: SectionHeader | null
  usingFallback: boolean
}

export async function resolveBlogs(): Promise<ResolvedBlogs> {
  try {
    const data = await getBlogs()
    if (data.blogs?.length) {
      return { blogs: data.blogs, header: data.header ?? null, usingFallback: false }
    }
  } catch {
    /* fall through to the bundled posts */
  }
  return { blogs: FALLBACK_BLOGS, header: null, usingFallback: true }
}

export interface ResolvedBlog {
  blog: BlogDetail
  related: BlogListItem[]
}

/** Up to three other posts, preferring the same category. */
function fallbackRelated(slug: string, categorySlug?: string | null) {
  const others = FALLBACK_BLOGS.filter((b) => b.slug !== slug)
  const sameCategory = others.filter((b) => b.category?.slug === categorySlug)
  return [
    ...sameCategory,
    ...others.filter((b) => !sameCategory.includes(b)),
  ].slice(0, 3)
}

/** Returns null when the slug matches neither the API nor the bundled posts. */
export async function resolveBlog(slug: string): Promise<ResolvedBlog | null> {
  try {
    const data = await getBlog(slug)
    if (data.blog) return { blog: data.blog, related: data.related ?? [] }
  } catch {
    /* fall through to the bundled posts */
  }

  const local = findFallbackBlog(slug)
  if (!local) return null
  return { blog: local, related: fallbackRelated(slug, local.category?.slug) }
}
