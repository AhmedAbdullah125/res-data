import { useEffect, useState } from 'react'
import axios from 'axios'
import { getBlogs } from '../services/blog'
import { FALLBACK_BLOGS } from '../data/fallbackBlogs'
import type { BlogListItem } from '../types/blog'
import type { SectionHeader } from '../types/api'

interface UseBlogsState {
  blogs: BlogListItem[]
  header: SectionHeader | null
  loading: boolean
  /** True when the list came from the bundled posts rather than the API. */
  usingFallback: boolean
}

/**
 * Loads the blog index. If the endpoint is missing, errors, or returns no
 * posts, the bundled articles are served instead — the page is never empty.
 */
export function useBlogs(): UseBlogsState {
  const [blogs, setBlogs] = useState<BlogListItem[]>([])
  const [header, setHeader] = useState<SectionHeader | null>(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getBlogs(controller.signal)
      .then((data) => {
        if (data.blogs?.length) {
          setBlogs(data.blogs)
          setHeader(data.header ?? null)
          setUsingFallback(false)
        } else {
          setBlogs(FALLBACK_BLOGS)
          setUsingFallback(true)
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) return
        setBlogs(FALLBACK_BLOGS)
        setUsingFallback(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { blogs, header, loading, usingFallback }
}
