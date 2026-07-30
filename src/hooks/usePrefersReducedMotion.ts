import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion`, so JS-driven motion (autoplaying video, for
 * instance) can opt out the same way the `motion-reduce:` utilities do for CSS.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
