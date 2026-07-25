import { useEffect, useState } from 'react'
import { prefetchQuestions } from '../../services/form'
import LeadFormModal from './LeadFormModal'

/** Warm the step-1 questions at 9s so the popup opens fully populated ~10s. */
const PREFETCH_MS = 9_000

/**
 * Warms the step-1 questions in the background, then opens the booking popup.
 * Fires on every visit to the home page.
 */
export default function HomePopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fetch questions first; open once ready (or failed) so there's no
      // empty-then-fills flash inside the modal.
      prefetchQuestions(1).finally(() => setOpen(true))
    }, PREFETCH_MS)
    return () => clearTimeout(timer)
  }, [])

  if (!open) return null
  return <LeadFormModal onClose={() => setOpen(false)} />
}
