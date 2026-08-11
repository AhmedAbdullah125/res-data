'use client'

import { useEffect, useState } from 'react'
// import { prefetchQuestions } from '@/services/form' // only the in-house wizard needed warming
// import LeadFormModal from '@/components/form/LeadFormModal' // replaced by the HubSpot embed — kept for rollback
import HubSpotFormModal from '@/components/form/HubSpotFormModal'

/** Warm the step-1 questions at 44s so the popup opens fully populated ~45s. */
const PREFETCH_MS = 44_000

/**
 * Opens the booking popup on every visit to the home page. It now shows the
 * HubSpot embed — the same form as /get-started — instead of the in-house
 * wizard, which stays commented out below until the HubSpot form is signed off.
 */
export default function HomePopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // The HubSpot embed loads its own iframe, so there's nothing to prefetch.
      // prefetchQuestions(1).finally(() => setOpen(true))
      setOpen(true)
    }, PREFETCH_MS)
    return () => clearTimeout(timer)
  }, [])

  if (!open) return null
  // return <LeadFormModal onClose={() => setOpen(false)} />
  return <HubSpotFormModal onClose={() => setOpen(false)} />
}
