import { useEffect, useRef, useState } from 'react'

interface UseScrollProgressOptions {
  /**
   * Where the element's top edge sits when progress starts, as a fraction of
   * the viewport height. `0.9` = just before it clears the bottom edge.
   */
  start?: number
  /**
   * How far the page scrolls, in viewport heights, between progress 0 and 1.
   */
  distance?: number
}

/**
 * Tracks how far a element has travelled up the viewport, as 0 → 1.
 *
 * `useInView` answers "is it visible yet"; this answers "how far through it are
 * we", which is what a reveal that unfolds in stages as the reader scrolls
 * needs. Measurement is rAF-throttled and the value is quantised, so a scroll
 * gesture re-renders a handful of times rather than on every event.
 */
export function useScrollProgress<T extends Element>({
  start = 0.9,
  distance = 0.55,
}: UseScrollProgressOptions = {}) {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const travelled = viewport * start - rect.top
      const next = Math.min(1, Math.max(0, travelled / (viewport * distance || 1)))
      setProgress((prev) => (Math.abs(prev - next) < 0.02 ? prev : next))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    // Sections above this one arrive from the API after mount and push it down
    // the page. Without re-measuring, a reader who never scrolls again is stuck
    // with whatever progress happened to be true at mount.
    const resize = new ResizeObserver(schedule)
    resize.observe(el)
    resize.observe(document.body)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [start, distance])

  return [ref, progress] as const
}
