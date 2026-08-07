'use client'

import { useEffect, useMemo, useState } from 'react'
import { useInView } from '@/hooks/useInView'

interface CountUpProps {
  /** e.g. "300+", "$40M+", "US Wide" (non-numeric renders unchanged). */
  value: string
  className?: string
}

/**
 * Animates the numeric part of a value from 0 to its target once it scrolls
 * into view, preserving any prefix/suffix ("$40M+" counts 40, keeps "$"/"M+").
 */
export default function CountUp({ value, className }: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>()
  const parsed = useMemo(() => value.match(/^(\D*)(\d[\d,]*)(.*)$/), [value])
  const target = parsed ? Number(parsed[2].replace(/,/g, '')) : 0
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!parsed || !inView) return
    let raf = 0
    let startTs = 0
    const duration = 1500
    const step = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setN(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, parsed, target])

  return (
    <span ref={ref} className={className}>
      {parsed ? (
        <>
          {parsed[1]}
          {n.toLocaleString()}
          {parsed[3]}
        </>
      ) : (
        value
      )}
    </span>
  )
}
