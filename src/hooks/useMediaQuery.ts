'use client'

import { useEffect, useState } from 'react'

/** Tracks a CSS media query from JS, for layout that can't be expressed in CSS. */
export function useMediaQuery(query: string): boolean {
  // Starts false so the server HTML and the first client render agree; the
  // effect below corrects it before paint.
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}
