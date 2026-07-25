import { useEffect, useState } from 'react'
import axios from 'axios'
import { getHomePage } from '../services/landingPage'
import type { HomePageData } from '../types/home'

interface UseHomePageState {
  data: HomePageData | null
  loading: boolean
  error: string | null
}

/**
 * Fetches GET /api/landing-page/home once on mount.
 * Aborts the request on unmount to avoid setting state after teardown.
 */
export function useHomePage(): UseHomePageState {
  const [data, setData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    getHomePage(controller.signal)
      .then((result) => setData(result))
      .catch((err) => {
        if (axios.isCancel(err)) return
        setError(err instanceof Error ? err.message : 'Failed to load home page')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { data, loading, error }
}
