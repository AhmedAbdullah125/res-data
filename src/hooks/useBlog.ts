import { useEffect, useState } from 'react'
import axios from 'axios'
import { getBlog } from '../services/blog'
import { FALLBACK_BLOGS, findFallbackBlog } from '../data/fallbackBlogs'
import type { BlogDetail, BlogListItem } from '../types/blog'

interface UseBlogState {
  blog: BlogDetail | null
  related: BlogListItem[]
  loading: boolean
  /** True once we know the slug matches neither the API nor the bundled posts. */
  notFound: boolean
}

/** Up to three other posts, preferring the same category. */
function fallbackRelated(slug: string, categorySlug?: string | null) {
  const others = FALLBACK_BLOGS.filter((b) => b.slug !== slug)
  const sameCategory = others.filter((b) => b.category?.slug === categorySlug)
  return [...sameCategory, ...others.filter((b) => !sameCategory.includes(b))].slice(0, 3)
}

/**
 * Loads one post by slug, falling back to the bundled articles whenever the
 * API can't serve it. Mirrors {@link useBlogs}.
 */
export function useBlog(slug: string | undefined): UseBlogState {
  const [blog, setBlog] = useState<BlogDetail | null>(null)
  const [related, setRelated] = useState<BlogListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setNotFound(false)

    /** Serve the bundled copy of this slug, or flag a 404. */
    const useBundled = () => {
      const local = findFallbackBlog(slug)
      if (local) {
        setBlog(local)
        setRelated(fallbackRelated(slug, local.category?.slug))
      } else {
        setBlog(null)
        setNotFound(true)
      }
    }

    getBlog(slug, controller.signal)
      .then((data) => {
        if (data.blog) {
          setBlog(data.blog)
          setRelated(data.related ?? [])
        } else {
          useBundled()
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        useBundled()
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [slug])

  return { blog, related, loading, notFound }
}
