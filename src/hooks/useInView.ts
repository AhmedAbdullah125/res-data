import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** How much of the element must be visible before it triggers (0–1). */
  threshold?: number
  /** Disconnect after the first reveal so it never re-hides. Default true. */
  once?: boolean
  /** Margin around the root viewport, e.g. "0px 0px -10% 0px". */
  rootMargin?: string
}

/**
 * Tracks whether the referenced element is in the viewport.
 * Shared by the stat count-up and the scroll-reveal animations.
 */
export function useInView<T extends Element>({
  threshold = 0.15,
  once = true,
  rootMargin = '0px 0px -8% 0px',
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, inView] as const
}
