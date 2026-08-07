import { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Returns `scrollToSection(path, id)` — smooth-scrolls to an element id,
 * routing to `path` first when the section lives on another page.
 *
 * Shared by the navbar and the footer so both behave identically.
 */
export function useScrollToSection() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
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

      navigate(path)
      // Pages fetch their content behind a splash, so the section may not exist
      // yet. Poll for it (up to ~3s) instead of guessing a fixed delay.
      let tries = 0
      timer.current = window.setInterval(() => {
        const el = document.getElementById(section)
        if (el || tries++ > 60) {
          el?.scrollIntoView({ behavior: 'smooth' })
          stopPolling()
        }
      }, 50)
    },
    [navigate, pathname],
  )
}
