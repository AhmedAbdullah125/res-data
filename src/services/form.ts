import api from '../lib/api'
import type { ApiResponse } from '../types/api'
import type {
  FormLandingData,
  FormQuestion,
  Step1Payload,
  Step2Availability,
  FormAnswer,
} from '../types/form'

const VISITOR_KEY = 'res_data_visitor_id'

/** Stable per-visitor id, generated once and persisted in localStorage. */
function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

function visitorHeaders(): Record<string, string> {
  return { 'X-Visitor-Id': getVisitorId() }
}

/** GET /api/landing-page/form — page chrome + social proof. */
export async function getFormLanding(signal?: AbortSignal): Promise<FormLandingData> {
  const { data } = await api.get<ApiResponse<FormLandingData>>(
    '/api/landing-page/form',
    { signal, headers: visitorHeaders() },
  )
  return data.data
}

/** GET the dynamic questions for step 1 or step 3. */
export async function getFormQuestions(
  step: 1 | 3,
  signal?: AbortSignal,
): Promise<FormQuestion[]> {
  const { data } = await api.get<ApiResponse<FormQuestion[]>>(
    `/api/landing-page/form-questions/step-${step}`,
    { signal, headers: visitorHeaders() },
  )
  return data.data
}

/* ---------------------------------------------------------------------------
   Prefetch cache — lets us warm an endpoint in the background (e.g. before the
   popup opens, or while the user fills the previous step) and read the result
   instantly. Requests are de-duplicated by key.
--------------------------------------------------------------------------- */

const questionCache = new Map<number, FormQuestion[]>()
const questionInflight = new Map<number, Promise<FormQuestion[]>>()

/** Fetch (or return cached) step questions; safe to call repeatedly. */
export function prefetchQuestions(step: 1 | 3): Promise<FormQuestion[]> {
  const cached = questionCache.get(step)
  if (cached) return Promise.resolve(cached)
  let inflight = questionInflight.get(step)
  if (!inflight) {
    inflight = getFormQuestions(step)
      .then((q) => {
        questionCache.set(step, q)
        return q
      })
      .finally(() => questionInflight.delete(step))
    questionInflight.set(step, inflight)
  }
  return inflight
}

/** Synchronously read cached questions (undefined until prefetched). */
export function cachedQuestions(step: 1 | 3): FormQuestion[] | undefined {
  return questionCache.get(step)
}

const availabilityCache = new Map<string, Step2Availability>()
const availabilityInflight = new Map<string, Promise<Step2Availability>>()

/** Fetch (or return cached) step-2 availability for a given date. */
export function prefetchAvailability(dateTime: string): Promise<Step2Availability> {
  const cached = availabilityCache.get(dateTime)
  if (cached) return Promise.resolve(cached)
  let inflight = availabilityInflight.get(dateTime)
  if (!inflight) {
    inflight = getStep2Availability(dateTime)
      .then((a) => {
        availabilityCache.set(dateTime, a)
        return a
      })
      .finally(() => availabilityInflight.delete(dateTime))
    availabilityInflight.set(dateTime, inflight)
  }
  return inflight
}

/** Synchronously read cached availability (undefined until prefetched). */
export function cachedAvailability(dateTime: string): Step2Availability | undefined {
  return availabilityCache.get(dateTime)
}

/** POST step 1 — user details + question answers. */
export async function submitStep1(payload: Step1Payload): Promise<void> {
  await api.post('/api/landing-page/form-questions/step-1', payload, {
    headers: visitorHeaders(),
  })
}

/** GET available days/slots for step 2, scoped to a chosen date (YYYY-MM-DD). */
export async function getStep2Availability(
  dateTime: string,
  signal?: AbortSignal,
): Promise<Step2Availability> {
  const { data } = await api.get<ApiResponse<Step2Availability>>(
    '/api/landing-page/form-questions/step-2',
    { params: { date_time: dateTime }, signal, headers: visitorHeaders() },
  )
  return data.data
}

/** POST step 2 — the chosen slot as "YYYY-MM-DD HH:mm" (multipart form-data). */
export async function submitStep2(dateTime: string): Promise<void> {
  const form = new FormData()
  form.append('date_time', dateTime)
  await api.post('/api/landing-page/form-questions/step-2', form, {
    headers: visitorHeaders(),
  })
}

/** POST step 3 — final answers. Booking is confirmed on success. */
export async function submitStep3(answers: FormAnswer[]): Promise<string> {
  const { data } = await api.post<ApiResponse<null>>(
    '/api/landing-page/form-questions/step-3',
    { answers },
    { headers: visitorHeaders() },
  )
  return data.message
}
