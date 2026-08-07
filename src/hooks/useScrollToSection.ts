'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Returns `scrollToSection(path, id)` — smooth-scrolls to an element id,
 * routing to `path` first when the section lives on another page.
 *
 * Shared by the navbar and the footer so both behave identically.
 */
export function useScrollToSection() {
  const router = useRouter()
  const pathname = usePathname()
  const timer = useRef<number | null>(null)

  const stopPolling = () => {
    if (timer.current !== null) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  // Don't keep polling after the component unmounts.
  useEffect(() => stopPolling, [])

  return useCallback(
    (path: string, section: string) => {
      stopPolling()

      if (pathname === path) {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      router.push(path)
      // The target page renders after navigation resolves, so the section may
      // not exist yet. Poll for it (up to ~3s) instead of guessing a delay.
      let tries = 0
      timer.current = window.setInterval(() => {
        const el = document.getElementById(section)
        if (el || tries++ > 60) {
          el?.scrollIntoView({ behavior: 'smooth' })
          stopPolling()
        }
      }, 50)
    },
    [router, pathname],
  )
}
