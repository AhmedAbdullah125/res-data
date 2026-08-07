'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  cachedAvailability,
  prefetchAvailability,
  prefetchQuestions,
} from '@/services/form'
import type { Step2Availability } from '@/types/form'
import Calendar, { formatDate } from '@/components/form/Calendar'

interface StepScheduleProps {
  date: string | null
  time: string | null
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onBack: () => void
  onContinue: () => void
  submitting: boolean
  error: string | null
}

/** Formats "14:30" → "2:30 PM". */
function label12h(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

export default function StepSchedule({
  date,
  time,
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
  submitting,
  error,
}: StepScheduleProps) {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const activeDate = date ?? formatDate(todayStart)

  // Seed from the prefetched cache so the calendar renders instantly.
  const [availability, setAvailability] = useState<Step2Availability | null>(
    () => cachedAvailability(activeDate) ?? null,
  )
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Warm step 3 while the user picks a time.
  useEffect(() => {
    prefetchQuestions(3).catch(() => undefined)
  }, [])

  // Load the calendar config (and slots for the active date).
  useEffect(() => {
    const controller = new AbortController()
    const cached = cachedAvailability(activeDate)
    if (cached) {
      setAvailability(cached)
      return
    }
    setLoadingSlots(true)
    prefetchAvailability(activeDate)
      .then((a) => {
        if (!controller.signal.aborted) setAvailability(a)
      })
      .catch((err) => {
        if (!axios.isCancel(err)) setAvailability(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSlots(false)
      })
    return () => controller.abort()
    // Re-fetch whenever the chosen date changes (slots are date-scoped).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate])

  const isDateDisabled = (d: Date): boolean => {
    if (d < todayStart) return true
    if (!availability) return false
    const weekday = d.toLocaleString('en-US', { weekday: 'long' })
    const cfg = availability.days.find((x) => x.name === weekday)
    if (cfg && cfg.is_active === 0) return true
    return availability.unavailable_days.includes(formatDate(d))
  }

  const slots = availability?.slots ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Choose a time</h2>
        <p className="mt-1 text-sm text-slate-500">All times shown in your timezone.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
        {/* Calendar */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-navy">
            <svg viewBox="0 0 16 16" className="size-4 text-brand" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 6h12M6 2v2M10 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Available dates
          </div>
          <Calendar value={date} onSelect={onDateChange} isDisabled={isDateDisabled} />
        </div>

        {/* Times */}
        <div className="sm:w-52">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-navy">
            <svg viewBox="0 0 16 16" className="size-4 text-brand" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Times
          </div>

          {!date ? (
            <p className="text-sm text-slate-500">Select a date to see open slots.</p>
          ) : loadingSlots ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-slate-500">No open slots for this date.</p>
          ) : (
            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const selected = time === slot.time
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.is_available}
                    onClick={() => onTimeChange(slot.time)}
                    className={[
                      'rounded-lg border px-4 py-2.5 text-sm transition-colors',
                      selected
                        ? 'border-navy bg-navy font-medium text-white'
                        : slot.is_available
                          ? 'border-slate-200 text-navy hover:border-navy'
                          : 'border-slate-100 bg-slate-50 text-slate-300 line-through',
                    ].join(' ')}
                  >
                    {label12h(slot.time)}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-navy transition-colors hover:text-brand"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!date || !time || submitting}
          className="flex items-center gap-1 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-light disabled:opacity-40"
        >
          {submitting ? 'Saving…' : 'Continue'}
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
