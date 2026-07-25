import { useEffect, useState } from 'react'
import { cachedQuestions, prefetchQuestions } from '../../services/form'
import type { FormQuestion } from '../../types/form'
import QuestionField, { type AnswerValue } from './QuestionField'

interface StepMoreProps {
  answers: Record<number, AnswerValue>
  onAnswerChange: (questionId: number, value: AnswerValue) => void
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  error: string | null
}

export default function StepMore({
  answers,
  onAnswerChange,
  onBack,
  onSubmit,
  submitting,
  error,
}: StepMoreProps) {
  const [questions, setQuestions] = useState<FormQuestion[]>(
    () => cachedQuestions(3) ?? [],
  )

  useEffect(() => {
    let cancelled = false
    prefetchQuestions(3)
      .then((q) => {
        if (!cancelled) setQuestions(q)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-navy">A few optional details</h2>
        <p className="mt-1 text-sm text-brand">Helps us tailor the call. Feel free to skip.</p>
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => onAnswerChange(q.id, v)}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-2">
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

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="text-sm font-medium text-brand transition-colors hover:text-brand-dark disabled:opacity-40"
          >
            Skip &amp; book
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-light disabled:opacity-40"
          >
            {submitting ? 'Booking…' : 'Confirm meeting'}
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
