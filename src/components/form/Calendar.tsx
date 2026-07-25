import { useState } from 'react'

interface CalendarProps {
  /** Selected date as YYYY-MM-DD, or null. */
  value: string | null
  onSelect: (date: string) => void
  /** Return true for dates that cannot be picked. */
  isDisabled: (date: Date) => boolean
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Local YYYY-MM-DD (avoids timezone shifts from toISOString). */
export function formatDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export default function Calendar({ value, onSelect, isDisabled }: CalendarProps) {
  const today = new Date()
  const initial = value ? new Date(`${value}T00:00:00`) : today
  const [view, setView] = useState(startOfMonth(initial))

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Disable navigating to months entirely in the past.
  const canGoPrev =
    startOfMonth(view) > startOfMonth(today)

  const monthLabel = view.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-md text-navy transition-colors hover:bg-slate-100 disabled:opacity-30"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-sm font-medium text-navy">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-md text-navy transition-colors hover:bg-slate-100"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="py-1 text-xs font-medium text-slate-400">
            {d}
          </div>
        ))}

        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1)
          const iso = formatDate(date)
          const disabled = isDisabled(date)
          const selected = value === iso
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={[
                'mx-auto flex size-9 items-center justify-center rounded-lg text-sm transition-colors',
                selected
                  ? 'bg-navy font-semibold text-white'
                  : disabled
                    ? 'text-slate-300 line-through'
                    : 'text-navy hover:bg-slate-100',
              ].join(' ')}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
