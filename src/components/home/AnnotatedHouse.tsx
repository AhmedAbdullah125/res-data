import { useState } from 'react'
import type { AnnotationPosition, MotivatedSellerAnnotation } from '../../types/home'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

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

/**
 * Desktop canvas ratio. The SVG viewBox uses the same ratio (`100 * ASPECT`
 * wide by `100` tall) so connectors aren't distorted — an elbow drawn at 45°
 * renders at 45°, and the dash animation advances evenly along the path.
 */
const ASPECT = 2.1

/**
 * Label positions and the point on the house each one connects to, in percent
 * of the overlay canvas.
 *
 * The artwork is a square transparent PNG whose house occupies the middle
 * ~69% × ~48% of the frame, so it's drawn at 170% of the canvas height
 * (`lg:h-[170%]` below) — a plain 1:1 fit would leave the house small and
 * strand a quarter of the frame as empty padding above and below it. At that
 * scale the house covers ~56% of the canvas width and ~82% of its height,
 * spanning roughly x 22–78% and y 9–91%, which is what these anchors are
 * measured against.
 *
 * Anchors are geometric, not label-specific: `top-left` points at the left
 * roof slope, `middle-right` at the upper right window, and so on, so moving a
 * label to another slot in the dashboard lands it somewhere sensible.
 */
const SLOTS: Record<AnnotationPosition, Slot> = {
  'top-left': { side: 'left', labelY: 17, labelEdge: 18, point: { x: 31.8, y: 27.4 } },
  'middle-left': { side: 'left', labelY: 50, labelEdge: 18, point: { x: 32.8, y: 45.7 } },
  'bottom-left': { side: 'left', labelY: 88, labelEdge: 18, point: { x: 39, y: 74.8 } },
  'top-right': { side: 'right', labelY: 11, labelEdge: 82, point: { x: 53.5, y: 21.7 } },
  'middle-right': { side: 'right', labelY: 45, labelEdge: 82, point: { x: 63, y: 41 } },
  'bottom-right': { side: 'right', labelY: 82, labelEdge: 82, point: { x: 60.4, y: 71.2 } },
}

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
 * Elbow connector in viewBox units: a short straight run out of the label, a
 * rounded corner, then a diagonal to its point on the house.
 */
function connectorPath({ side, labelY, labelEdge, point }: Slot) {
  const dir = side === 'left' ? 1 : -1
  const start = { x: labelEdge * ASPECT, y: labelY }
  const corner = { x: start.x + dir * 9, y: labelY }
  const end = { x: point.x * ASPECT, y: point.y }

  const dx = end.x - corner.x
  const dy = end.y - corner.y
  const len = Math.hypot(dx, dy) || 1
  const radius = Math.min(6, len / 2)
  const before = { x: corner.x - dir * radius, y: corner.y }
  const after = { x: corner.x + (dx / len) * radius, y: corner.y + (dy / len) * radius }

  return [
    `M ${start.x.toFixed(2)} ${start.y}`,
    `L ${before.x.toFixed(2)} ${before.y}`,
    `Q ${corner.x.toFixed(2)} ${corner.y} ${after.x.toFixed(2)} ${after.y.toFixed(2)}`,
    `L ${end.x.toFixed(2)} ${end.y}`,
  ].join(' ')
}

/**
 * Draws the data-point labels over the clean property image: connectors "draw
 * themselves" and labels slide in from their side once the figure scrolls into
 * view, and hovering a label thickens its connector, pops a dot on the house
 * and dims the others. Below `lg` there's no room for the overlay, so the
 * labels render as a chip list under the image instead.
 */
export default function AnnotatedHouse({ src, annotations, onImageError }: AnnotatedHouseProps) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>()
  const reducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  const inView = reducedMotion || progress > 0
  const seen = new Map<number, number>()

  const items = annotations.slice(0, SLOT_ORDER.length).map((annotation, i) => {
    const position = annotation.position ?? SLOT_ORDER[i]
    const slot = SLOTS[position] ?? SLOTS[SLOT_ORDER[i]]
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
      <div className="relative mx-auto aspect-square w-full max-w-lg lg:aspect-[2.1/1] lg:max-w-none">
        <img
          src={src}
          alt="Single-family home"
          onError={onImageError}
          className={`absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-1000 ease-out motion-reduce:transition-none lg:h-[170%] lg:w-auto lg:max-w-none ${
            inView ? 'scale-100 opacity-100' : 'scale-95 opacity-0 motion-reduce:opacity-100'
          }`}
        />

        {/* Connectors — the viewBox matches the canvas ratio, so nothing skews */}
        <svg
          viewBox={`0 0 ${100 * ASPECT} 100`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden size-full lg:block"
        >
          {items.map(({ annotation, slot, delay, shown }, i) => (
            <path
              key={annotation.id}
              d={connectorPath(slot)}
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
                strokeWidth: active === i ? 1.5 : 1,
                strokeDashoffset: shown ? 0 : 1,
                transitionDelay: `${delay}ms`,
              }}
            />
          ))}

          {/* Invisible fat strokes over the same routes, so the label reacts
              anywhere near its arrow instead of only on the text itself. */}
          {items.map(({ annotation, slot }, i) => (
            <path
              key={`hit-${annotation.id}`}
              d={connectorPath(slot)}
              fill="none"
              stroke="transparent"
              strokeWidth={7}
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
              cx={slot.point.x * ASPECT}
              cy={slot.point.y}
              r={5}
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
            className={`pointer-events-none absolute hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-dark ring-4 ring-brand/20 transition-transform duration-300 ease-out lg:block ${
              active === i ? 'scale-100' : 'scale-0'
            }`}
            style={{ left: `${slot.point.x}%`, top: `${slot.point.y}%` }}
          />
        ))}

        {/* Labels — the padding is the hover target, so it stays generous */}
        {items.map(({ annotation, slot, delay, shown }, i) => {
          const dimmed = active !== null && active !== i
          return (
            <div
              key={`label-${annotation.id}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                top: `${slot.labelY}%`,
                right: slot.side === 'left' ? `calc(${100 - slot.labelEdge}% - 0.75rem)` : undefined,
                left: slot.side === 'right' ? `calc(${slot.labelEdge}% - 0.75rem)` : undefined,
                transitionDelay: `${delay}ms`,
              }}
              className={[
                'absolute hidden -translate-y-1/2 cursor-default whitespace-nowrap px-3 py-3 text-sm font-bold transition-all duration-700 ease-out motion-reduce:transition-none lg:block xl:text-base',
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

      {/* Small screens: the same labels as chips under the image */}
      <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:hidden">
        {annotations.map((annotation) => (
          <li
            key={annotation.id}
            className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-sm font-semibold text-brand"
          >
            {annotation.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
