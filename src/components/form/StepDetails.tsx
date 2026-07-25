import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  cachedQuestions,
  prefetchAvailability,
  prefetchQuestions,
} from '../../services/form'
import type { FormQuestion, FormUser } from '../../types/form'
import QuestionField, { type AnswerValue } from './QuestionField'
import { formatDate } from './Calendar'

interface StepDetailsProps {
  user: FormUser
  onUserChange: (user: FormUser) => void
  answers: Record<number, AnswerValue>
  onAnswerChange: (questionId: number, value: AnswerValue) => void
  onContinue: () => void
  submitting: boolean
  error: string | null
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:bg-white'

export default function StepDetails({
  user,
  onUserChange,
  answers,
  onAnswerChange,
  onContinue,
  submitting,
  error,
}: StepDetailsProps) {
  // Prefer prefetched questions so there's no flash; fall back to fetching.
  const [questions, setQuestions] = useState<FormQuestion[]>(
    () => cachedQuestions(1) ?? [],
  )

  useEffect(() => {
    let cancelled = false
    prefetchQuestions(1)
      .then((q) => {
        if (!cancelled) setQuestions(q)
      })
      .catch(() => undefined)
      // Once step 1 is loaded, warm step 2 so the transition is instant.
      .finally(() => prefetchAvailability(formatDate(new Date())))
    return () => {
      cancelled = true
    }
  }, [])

  const set = (key: keyof FormUser) => (value: string) =>
    onUserChange({ ...user, [key]: value })

  const canContinue =
    user.full_name.trim() !== '' && user.email.trim() !== '' && !submitting

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Let’s get acquainted</h2>
        <p className="mt-1 text-sm text-slate-500">
          We’ll use this to confirm your meeting.
        </p>
      </div>

      {/* User details */}
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-navy">Full name</span>
          <input
            type="text"
            value={user.full_name}
            onChange={(e) => set('full_name')(e.target.value)}
            placeholder="Jane Investor"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-navy">Work email</span>
          <input
            type="email"
            value={user.email}
            onChange={(e) => set('email')(e.target.value)}
            placeholder="jane@firm.com"
            className={inputClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-navy">Phone</span>
            <input
              type="tel"
              value={user.phone}
              onChange={(e) => set('phone')(e.target.value)}
              placeholder="(555) 123-4567"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-navy">Market</span>
            <input
              type="text"
              value={user.market}
              onChange={(e) => set('market')(e.target.value)}
              placeholder="Acme Capital"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      {/* Dynamic questions */}
      {questions.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
          {questions.map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(v) => onAnswerChange(q.id, v)}
            />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-600"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cancel
        </Link>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-light disabled:opacity-40"
        >
          {submitting ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
