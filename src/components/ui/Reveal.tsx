'use client'

import type { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  /** Slide-in direction while hidden. Default "up". */
  direction?: Direction
  /** Stagger delay in ms (useful when revealing a list of siblings). */
  delay?: number
  className?: string
}

/** Off-screen transform for each direction (undone once in view). */
const HIDDEN: Record<Direction, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  none: '',
}

/**
 * Fades + slides its children into place the first time they scroll into view.
 * Uses a CSS transition (no JS animation loop) and disables motion for users
 * who prefer reduced motion.
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        'transition-all duration-700 ease-out motion-reduce:transition-none',
        inView
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${HIDDEN[direction]} motion-reduce:opacity-100`,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
