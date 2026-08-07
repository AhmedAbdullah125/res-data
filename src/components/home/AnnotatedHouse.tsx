'use client'

import { useState } from 'react'
import type { AnnotationPosition, MotivatedSellerAnnotation } from '@/types/home'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface AnnotatedHouseProps {
  /** Unannotated property image — ideally a square transparent PNG. */
  src: string
  annotations: MotivatedSellerAnnotation[]
  /** Lets the caller fall back to the legacy baked-in image if `src` 404s. */
  onImageError?: () => void
}

interface Slot {
  side: 'left' | 'right'
  /** Vertical centre of the label, % of the canvas height. */
  labelY: number
  /** Inner edge of the label — where its connector starts, % of canvas width. */
  labelEdge: number
  /** Where the connector lands on the house, % of the canvas. */
  point: { x: number; y: number }
}

const POSITIONS: AnnotationPosition[] = [
  'top-left',
  'middle-left',
  'bottom-left',
  'top-right',
  'middle-right',
  'bottom-right',
]

/** Slot order used when the API doesn't say which slot a label belongs to. */
const SLOT_ORDER: AnnotationPosition[] = [
  'top-left',
  'top-right',
  'middle-left',
  'middle-right',
  'bottom-left',
  'bottom-right',
]

/**
 * The house's measured bounding box inside the artwork, as fractions of the
 * frame. The supplied PNG is square with a quarter of its height empty above
 * and below the house, so every layout below works from this box rather than
 * from the image edges.
 */
const ART = { x0: 0.168, x1: 0.856, y0: 0.264, y1: 0.748 }

/**
 * Where each connector lands, as a fraction of the house's own box: the roof
 * slopes, the two upper windows, the front door and the porch. Anchors are
 * geometric rather than label-specific, so re-assigning a label to another slot
 * in the dashboard still lands it somewhere sensible — and the same six points
 * work at any canvas size.
 */
const ANCHORS: Record<AnnotationPosition, { x: number; y: number }> = {
  'top-left': { x: 0.156, y: 0.213 },
  'middle-left': { x: 0.174, y: 0.435 },
  'bottom-left': { x: 0.286, y: 0.789 },
  'top-right': { x: 0.546, y: 0.144 },
  'middle-right': { x: 0.716, y: 0.378 },
  'bottom-right': { x: 0.67, y: 0.745 },
}

interface Layout {
  /** Canvas width ÷ height. The SVG viewBox matches, so nothing skews. */
  aspect: number
  /** Artwork height as a share of the canvas height; >1 overflows the frame. */
  imageScale: number
  labelEdge: { left: number; right: number }
  labelY: Record<AnnotationPosition, number>
  /** Straight run out of the label and corner radius, in viewBox units. */
  run: number
  radius: number
  stroke: { base: number; active: number; hit: number }
}

/**
 * Wide canvas, artwork overflowing to 170% so the house fills it: a 1:1 fit
 * would leave the house small and strand the artwork's empty margins as dead
 * space above and below.
 */
const DESKTOP: Layout = {
  aspect: 2.1,
  imageScale: 1.7,
  labelEdge: { left: 18, right: 82 },
  labelY: {
    'top-left': 17,
    'middle-left': 50,
    'bottom-left': 88,
    'top-right': 11,
    'middle-right': 45,
    'bottom-right': 82,
  },
  run: 9,
  radius: 6,
  stroke: { base: 1, active: 1.5, hit: 7 },
}

/**
 * Near-square canvas with the artwork scaled down instead, so the labels get
 * usable gutters on a phone. Same six anchors, same animation — just a tighter
 * frame around a smaller house.
 */
const MOBILE: Layout = {
  aspect: 1.15,
  imageScale: 0.8,
  labelEdge: { left: 25, right: 75 },
  labelY: {
    'top-left': 16,
    'middle-left': 50,
    'bottom-left': 84,
    'top-right': 12,
    'middle-right': 46,
    'bottom-right': 80,
  },
  run: 4,
  radius: 3,
  stroke: { base: 0.8, active: 1.2, hit: 5 },
}

/** The house's box in canvas percentages, given how the artwork is sized. */
function houseBox({ aspect, imageScale }: Layout) {
  const width = (imageScale / aspect) * 100
  const height = imageScale * 100
  const left = 50 - width / 2
  const top = 50 - height / 2
  return {
    x0: left + ART.x0 * width,
    x1: left + ART.x1 * width,
    y0: top + ART.y0 * height,
    y1: top + ART.y1 * height,
  }
}

function buildSlots(layout: Layout): Record<AnnotationPosition, Slot> {
  const box = houseBox(layout)
  const width = box.x1 - box.x0
  const height = box.y1 - box.y0

  return POSITIONS.reduce(
    (slots, position) => {
      const anchor = ANCHORS[position]
      const side = position.endsWith('left') ? 'left' : 'right'
      slots[position] = {
        side,
        labelY: layout.labelY[position],
        labelEdge: side === 'left' ? layout.labelEdge.left : layout.labelEdge.right,
        point: { x: box.x0 + anchor.x * width, y: box.y0 + anchor.y * height },
      }
      return slots
    },
    {} as Record<AnnotationPosition, Slot>,
  )
}

const SLOTS = { desktop: buildSlots(DESKTOP), mobile: buildSlots(MOBILE) }

/** Which of the three reveal phases a slot belongs to. */
const ROW: Record<AnnotationPosition, number> = {
  'top-left': 0,
  'top-right': 0,
  'middle-left': 1,
  'middle-right': 1,
  'bottom-left': 2,
  'bottom-right': 2,
}

/**
 * Scroll progress at which each phase starts drawing: the roof labels come in
 * first, then the windows, then the porch — so the figure unfolds top-to-bottom
 * as the reader scrolls through it rather than all at once.
 */
const ROW_START = [0.05, 0.33, 0.6]

/**
 * Elbow connector in viewBox units: a short straight run out of the label, a
 * rounded corner, then a diagonal to its point on the house.
 */
function connectorPath(slot: Slot, layout: Layout) {
  const dir = slot.side === 'left' ? 1 : -1
  const start = { x: slot.labelEdge * layout.aspect, y: slot.labelY }
  const corner = { x: start.x + dir * layout.run, y: slot.labelY }
  const end = { x: slot.point.x * layout.aspect, y: slot.point.y }

  const dx = end.x - corner.x
  const dy = end.y - corner.y
  const len = Math.hypot(dx, dy) || 1
  const radius = Math.min(layout.radius, len / 2)
  const before = { x: corner.x - dir * radius, y: corner.y }
  const after = { x: corner.x + (dx / len) * radius, y: corner.y + (dy / len) * radius }

  return [
    `M ${start.x.toFixed(2)} ${start.y}`,
    `L ${before.x.toFixed(2)} ${before.y}`,
    `Q ${corner.x.toFixed(2)} ${corner.y} ${after.x.toFixed(2)} ${after.y.toFixed(2)}`,
    `L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
  ].join(' ')
}

/**
 * Draws the data-point labels over the clean property image: connectors "draw
 * themselves" and labels slide in from their side in three phases as the figure
 * scrolls past, and hovering (or tapping) a label thickens its connector, pops
 * a dot on the house and dims the others. Phones get the same treatment on a
 * squarer canvas with the artwork scaled down to leave room for the labels.
 */
export default function AnnotatedHouse({ src, annotations, onImageError }: AnnotatedHouseProps) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>()
  const reducedMotion = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const [active, setActive] = useState<number | null>(null)

  const layout = desktop ? DESKTOP : MOBILE
  const slots = desktop ? SLOTS.desktop : SLOTS.mobile
  const started = reducedMotion || progress > 0
  const seen = new Map<number, number>()

  const items = annotations.slice(0, SLOT_ORDER.length).map((annotation, i) => {
    const position = annotation.position ?? SLOT_ORDER[i]
    const slot = slots[position] ?? slots[SLOT_ORDER[i]]
    const row = ROW[position] ?? 0
    // Stagger the two labels within a phase so they don't land in lockstep.
    const order = seen.get(row) ?? 0
    seen.set(row, order + 1)
    return {
      annotation,
      slot,
      delay: 60 + order * 90,
      shown: reducedMotion || progress >= ROW_START[row],
    }
  })

  return (
    <div ref={ref} className="w-full">
      <div
        className="relative mx-auto w-full max-w-lg lg:max-w-none"
        style={{ aspectRatio: `${layout.aspect}` }}
      >
        <img
          src={src}
          alt="Single-family home"
          onError={onImageError}
          style={{ height: `${layout.imageScale * 100}%` }}
          className={`absolute left-1/2 top-1/2 w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-1000 ease-out motion-reduce:transition-none ${
            started ? 'scale-100 opacity-100' : 'scale-95 opacity-0 motion-reduce:opacity-100'
          }`}
        />

        {/* Connectors — the viewBox matches the canvas ratio, so nothing skews */}
        <svg
          viewBox={`0 0 ${100 * layout.aspect} 100`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        >
          {items.map(({ annotation, slot, delay, shown }, i) => (
            <path
              key={annotation.id}
              d={connectorPath(slot, layout)}
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-[stroke-dashoffset,opacity] duration-700 ease-out motion-reduce:transition-none ${
                active !== null && active !== i ? 'opacity-30' : 'opacity-100'
              }`}
              style={{
                stroke: active === i ? 'var(--color-brand-dark)' : 'var(--color-brand)',
                strokeWidth: active === i ? layout.stroke.active : layout.stroke.base,
                strokeDashoffset: shown ? 0 : 1,
                transitionDelay: `${delay}ms`,
              }}
            />
          ))}

          {/* Invisible fat strokes over the same routes, so a label reacts
              anywhere near its arrow instead of only on the text itself. */}
          {items.map(({ annotation, slot }, i) => (
            <path
              key={`hit-${annotation.id}`}
              d={connectorPath(slot, layout)}
              fill="none"
              stroke="transparent"
              strokeWidth={layout.stroke.hit}
              strokeLinecap="round"
              style={{ pointerEvents: 'stroke' }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}

          {/* …and around each anchor point on the house itself. */}
          {items.map(({ annotation, slot }, i) => (
            <circle
              key={`hit-dot-${annotation.id}`}
              cx={slot.point.x * layout.aspect}
              cy={slot.point.y}
              r={layout.radius}
              fill="transparent"
              style={{ pointerEvents: 'all' }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>

        {/* Anchor dots — outside the SVG so they stay round at any canvas size */}
        {items.map(({ annotation, slot }, i) => (
          <span
            key={`dot-${annotation.id}`}
            aria-hidden="true"
            className={`pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-dark ring-4 ring-brand/20 transition-transform duration-300 ease-out lg:size-3 ${
              active === i ? 'scale-100' : 'scale-0'
            }`}
            style={{ left: `${slot.point.x}%`, top: `${slot.point.y}%` }}
          />
        ))}

        {/* Labels — the padding is part of the hover target, so it stays generous */}
        {items.map(({ annotation, slot, delay, shown }, i) => {
          const dimmed = active !== null && active !== i
          return (
            <div
              key={`label-${annotation.id}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive((current) => (current === i ? null : i))}
              style={{
                top: `${slot.labelY}%`,
                right: slot.side === 'left' ? `calc(${100 - slot.labelEdge}% - 0.5rem)` : undefined,
                left: slot.side === 'right' ? `calc(${slot.labelEdge}% - 0.5rem)` : undefined,
                // Phone gutters are narrow, so a label wraps inside its own
                // side rather than running off the edge of the frame.
                maxWidth: desktop
                  ? undefined
                  : `${slot.side === 'left' ? slot.labelEdge : 100 - slot.labelEdge}%`,
                transitionDelay: `${delay}ms`,
              }}
              className={[
                'absolute -translate-y-1/2 cursor-default px-2 py-2 text-[11px] font-bold leading-tight transition-all duration-700 ease-out motion-reduce:transition-none sm:text-xs lg:whitespace-nowrap lg:px-3 lg:py-3 lg:text-sm xl:text-base',
                slot.side === 'left' ? 'origin-right text-right' : 'origin-left text-left',
                shown ? 'translate-x-0' : slot.side === 'left' ? '-translate-x-4' : 'translate-x-4',
                !shown
                  ? 'opacity-0 motion-reduce:opacity-100'
                  : dimmed
                    ? 'opacity-40'
                    : 'opacity-100',
                active === i ? 'scale-110 text-brand-dark' : 'text-brand',
              ].join(' ')}
            >
              {annotation.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}
