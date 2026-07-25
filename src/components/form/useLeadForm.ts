import { useEffect, useState } from 'react'
import { submitStep1, submitStep2, submitStep3 } from '../../services/form'
import type { FormAnswer, FormUser } from '../../types/form'
import type { AnswerValue } from './QuestionField'

const STORAGE_KEY = 'res_data_lead_form'
/** Set once a booking completes, so the home popup stops appearing. */
export const BOOKED_KEY = 'res_data_lead_booked'

export type StepNo = 1 | 2 | 3
type Answers = Record<number, AnswerValue>

interface Persisted {
  step: StepNo
  user: FormUser
  step1: Answers
  date: string | null
  time: string | null
  step3: Answers
}

const EMPTY_USER: FormUser = { full_name: '', email: '', phone: '', market: '' }

const DEFAULT_STATE: Persisted = {
  step: 1,
  user: EMPTY_USER,
  step1: {},
  date: null,
  time: null,
  step3: {},
}

/** Load cached progress so the user can resume any time. */
function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    /* ignore corrupt cache */
  }
  return DEFAULT_STATE
}

/** Record<qid, value> → API answer array (drops empty answers). */
function toAnswers(record: Answers): FormAnswer[] {
  return Object.entries(record)
    .map(([qid, v]) => ({
      question_id: Number(qid),
      ids: v.ids && v.ids.length ? v.ids : null,
      text: v.text && v.text.trim() ? v.text : null,
    }))
    .filter((a) => a.ids !== null || a.text !== null)
}

function errorMessage(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { data?: { message?: string } } }).response?.data
      ?.message === 'string'
  ) {
    return (err as { response: { data: { message: string } } }).response.data.message
  }
  return 'Something went wrong. Please try again.'
}

export interface LeadForm {
  step: StepNo
  done: boolean
  successMessage: string
  submitting: boolean
  error: string | null
  user: FormUser
  step1: Answers
  step3: Answers
  date: string | null
  time: string | null
  setUser: (user: FormUser) => void
  setStep1Answer: (id: number, value: AnswerValue) => void
  setStep3Answer: (id: number, value: AnswerValue) => void
  setDate: (date: string) => void
  setTime: (time: string) => void
  goTo: (step: StepNo) => void
  submitStepOne: () => Promise<void>
  submitStepTwo: () => Promise<void>
  submitStepThree: () => Promise<void>
}

/**
 * Owns the multi-step lead-form state: localStorage caching (resume any time),
 * per-step API submission, and success handling. Shared by the full-page
 * wizard and the home-page popup so both stay in sync.
 */
export function useLeadForm(): LeadForm {
  const [state, setState] = useState<Persisted>(loadState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (done) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [state, done])

  const patch = (next: Partial<Persisted>) => setState((s) => ({ ...s, ...next }))
  const setAnswer = (key: 'step1' | 'step3') => (id: number, value: AnswerValue) =>
    setState((s) => ({ ...s, [key]: { ...s[key], [id]: value } }))

  const submitStepOne = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await submitStep1({ user: state.user, answers: toAnswers(state.step1) })
      patch({ step: 2 })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const submitStepTwo = async () => {
    if (!state.date || !state.time) return
    setSubmitting(true)
    setError(null)
    try {
      await submitStep2(`${state.date} ${state.time}`)
      patch({ step: 3 })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const submitStepThree = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const message = await submitStep3(toAnswers(state.step3))
      setSuccessMessage(message || 'Meeting booked successfully. We will contact you soon.')
      setDone(true)
      localStorage.removeItem(STORAGE_KEY)
      try {
        localStorage.setItem(BOOKED_KEY, '1')
      } catch {
        /* non-fatal */
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    step: state.step,
    done,
    successMessage,
    submitting,
    error,
    user: state.user,
    step1: state.step1,
    step3: state.step3,
    date: state.date,
    time: state.time,
    setUser: (user) => patch({ user }),
    setStep1Answer: setAnswer('step1'),
    setStep3Answer: setAnswer('step3'),
    setDate: (date) => patch({ date }),
    setTime: (time) => patch({ time }),
    goTo: (step) => patch({ step }),
    submitStepOne,
    submitStepTwo,
    submitStepThree,
  }
}
