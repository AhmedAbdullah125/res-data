'use client'

import { useEffect, useRef } from 'react'

/**
 * Client-supplied HubSpot embed (RES-DATA website form).
 *
 *   <script src="https://js.hsforms.net/forms/embed/24452375.js" defer></script>
 *   <div class="hs-form-frame" data-region="na1"
 *        data-form-id="5d1f9a41-786c-44f4-b849-01a32861c804"
 *        data-portal-id="24452375"></div>
 *
 * The embed script scans the DOM for `.hs-form-frame` when it executes. On a
 * client-side route change the script is already in the document and won't scan
 * again, so we drop any previous copy and append a fresh one on every mount —
 * that re-run is what fills the frame below.
 */

const PORTAL_ID = '24452375'
const FORM_ID = '5d1f9a41-786c-44f4-b849-01a32861c804'
const REGION = 'na1'
const SRC = `https://js.hsforms.net/forms/embed/${PORTAL_ID}.js`

interface HubSpotFormProps {
  /** Extra classes for the frame wrapper. */
  className?: string
}

export default function HubSpotForm({ className = '' }: HubSpotFormProps) {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.querySelectorAll(`script[src="${SRC}"]`).forEach((s) => s.remove())

    const script = document.createElement('script')
    script.src = SRC
    script.defer = true
    document.body.appendChild(script)

    const frame = frameRef.current
    return () => {
      // Leave the rendered iframe behind on unmount so a re-mount starts clean.
      if (frame) frame.innerHTML = ''
    }
  }, [])

  return (
    <div className={className}>
      <div
        ref={frameRef}
        className="hs-form-frame"
        data-region={REGION}
        data-form-id={FORM_ID}
        data-portal-id={PORTAL_ID}
      />
    </div>
  )
}
