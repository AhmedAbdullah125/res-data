import { useState } from 'react'
import type { AnnotationPosition, MotivatedSellerAnnotation } from '../../types/home'
import { useInView } from '../../hooks/useInView'

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
 * Label positions and the point on the house each one connects to, in percent
 * of the overlay canvas. The canvas is 2:1 and the image is `object-contain`,
 * so a square image sits in the middle 50% and the labels get the outer
 * quarters — mirroring the client's mock-up. Tuned for the supplied image with
 * the house centred; nudge these if the artwork's framing changes.
 */
const SLOTS: Record<AnnotationPosition, Slot> = {
  'top-left': { side: 'left', labelY: 17, labelEdge: 25, point: { x: 39, y: 32 } },
  'middle-left': { side: 'left', labelY: 47, labelEdge: 25, point: { x: 41, y: 47 } },
  'bottom-left': { side: 'left', labelY: 83, labelEdge: 25, point: { x: 44, y: 66 } },
  'top-right': { side: 'right', labelY: 12, labelEdge: 75, point: { x: 57, y: 30 } },
  'middle-right': { side: 'right', labelY: 45, labelEdge: 75, point: { x: 58, y: 47 } },
  'bottom-right': { side: 'right', labelY: 80, labelEdge: 75, point: { x: 60, y: 64 } },
}

/** Slot order used when the API doesn't say which slot a label belongs to. */
const SLOT_ORDER: AnnotationPosition[] = [
  'top-left',
  'top-right',
  'middle-left',
  'middle-right',
  'bottom-left',
  'bottom-right',
]

/** Elbow connector: a short run out of the label, then a line to the house. */
function connectorPath({ side, labelY, labelEdge, point }: Slot) {
  const bend = side === 'left' ? labelEdge + 5 : labelEdge - 5
  return `M ${labelEdge} ${labelY} L ${bend} ${labelY} L ${point.x} ${point.y}`
}

/**
 * Draws the data-point labels over the clean property image: connectors "draw
 * themselves" and labels slide in from their side once the figure scrolls into
 * view, and hovering a label thickens its connector, pops a dot on the house
 * and dims the others. Below `lg` there's no room for the overlay, so the
 * labels render as a chip list under the image instead.
 */
export default function AnnotatedHouse({ src, annotations, onImageError }: AnnotatedHouseProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 })
  const [active, setActive] = useState<number | null>(null)

  const items = annotations.slice(0, SLOT_ORDER.length).map((annotation, i) => ({
    annotation,
    slot: (annotation.position && SLOTS[annotation.position]) || SLOTS[SLOT_ORDER[i]],
  }))

  return (
    <div ref={ref} className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-md lg:aspect-[2/1] lg:max-w-3xl">
        <img
          src={src}
          alt="Single-family home"
          onError={onImageError}
          className={`absolute inset-0 size-full object-contain transition-all duration-1000 ease-out motion-reduce:transition-none ${
            inView ? 'scale-100 opacity-100' : 'scale-95 opacity-0 motion-reduce:opacity-100'
          }`}
        />

        {/* Connectors — percentage coordinates, uniform stroke via non-scaling-stroke */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden size-full lg:block"
        >
          {items.map(({ annotation, slot }, i) => (
            <path
              key={annotation.id}
              d={connectorPath(slot)}
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className={`transition-[stroke-dashoffset,opacity] duration-700 ease-out motion-reduce:transition-none ${
                active !== null && active !== i ? 'opacity-30' : 'opacity-100'
              }`}
              style={{
                stroke: active === i ? 'var(--color-brand-dark)' : 'var(--color-brand)',
                strokeWidth: active === i ? 5 : 3.5,
                strokeDashoffset: inView ? 0 : 1,
                transitionDelay: `${200 + i * 110}ms`,
              }}
            />
          ))}
        </svg>

        {/* Anchor dots — separate from the SVG so they stay round in the stretched viewBox */}
        {items.map(({ annotation, slot }, i) => (
          <span
            key={`dot-${annotation.id}`}
            aria-hidden="true"
            className={`pointer-events-none absolute hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-dark ring-4 ring-brand/20 transition-transform duration-300 ease-out lg:block ${
              active === i ? 'scale-100' : 'scale-0'
            }`}
            style={{ left: `${slot.point.x}%`, top: `${slot.point.y}%` }}
          />
        ))}

        {/* Labels */}
        {items.map(({ annotation, slot }, i) => {
          const dimmed = active !== null && active !== i
          return (
            <div
              key={`label-${annotation.id}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                top: `${slot.labelY}%`,
                right: slot.side === 'left' ? `${100 - slot.labelEdge}%` : undefined,
                left: slot.side === 'right' ? `${slot.labelEdge}%` : undefined,
                transitionDelay: `${200 + i * 110}ms`,
              }}
              className={[
                'absolute hidden -translate-y-1/2 cursor-default whitespace-nowrap px-2 text-xs font-bold transition-all duration-700 ease-out motion-reduce:transition-none lg:block xl:text-sm',
                slot.side === 'left' ? 'origin-right text-right' : 'origin-left text-left',
                inView ? 'translate-x-0' : slot.side === 'left' ? '-translate-x-4' : 'translate-x-4',
                !inView
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
