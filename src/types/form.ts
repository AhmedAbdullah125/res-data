import type { SectionHeader } from './api'
import type { Lead, Testimonial } from './home'

/* ---------------------------------------------------------------------------
   Types for the lead-registration flow (GET /api/landing-page/form and the
   multi-step /api/landing-page/form-questions/* endpoints).
--------------------------------------------------------------------------- */

/** Compact heading used at the top of the form page. */
export interface FormIntroHeader {
  title: string
  caption: string
  description: string
}

/** GET /api/landing-page/form — page chrome + social proof. */
export interface FormLandingData {
  header1: FormIntroHeader
  header2: SectionHeader
  leads: Lead[]
  header3: SectionHeader
  testimonials: Testimonial[]
}

export type QuestionType = 'select' | 'multi-select' | 'text'

export interface QuestionOption {
  id: number
  form_question_id: number
  value: string
}

/** A single dynamic question (step 1 and step 3). */
export interface FormQuestion {
  id: number
  name: string
  type: QuestionType
  /** Absent/empty for free-text questions. */
  options?: QuestionOption[]
}

/** Answer payload entry for POST step-1 / step-3. */
export interface FormAnswer {
  question_id: number
  ids: number[] | null
  text: string | null
}

/** User block collected in step 1. */
export interface FormUser {
  full_name: string
  email: string
  phone: string
  market: string
}

export interface Step1Payload {
  user: FormUser
  answers: FormAnswer[]
}

/** GET /api/landing-page/form-questions/step-2?date_time=YYYY-MM-DD */
export interface WeekdayConfig {
  name: string
  is_active: 0 | 1
}

export interface TimeSlot {
  time: string
  is_available: boolean
}

export interface Step2Availability {
  days: WeekdayConfig[]
  /** ISO dates (YYYY-MM-DD) that are fully blocked. */
  unavailable_days: string[]
  slots: TimeSlot[]
}
