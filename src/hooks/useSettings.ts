'use client'

import { useEffect, useState } from 'react'
import { getSettings } from '@/services/settings'
import type { SiteSettings } from '@/types/settings'

/**
 * Reads the shared site settings. Returns null until they arrive (and if the
 * request fails), so every consumer must keep a hard-coded fallback — the
 * chrome should never render empty just because the endpoint is down.
 */
export function useSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    let alive = true
    getSettings()
      .then((data) => {
        if (alive) setSettings(data)
      })
      .catch(() => {
        /* keep the fallbacks */
      })
    return () => {
      alive = false
    }
  }, [])

  return settings
}
