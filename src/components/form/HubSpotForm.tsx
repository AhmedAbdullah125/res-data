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
 *
 * STYLING — read before trying to restyle this form.
 * The script renders the form inside a cross-origin iframe on js.hsforms.net,
 * so nothing here can reach its labels, inputs or button: no CSS selector, no
 * injected stylesheet, no DOM access. Only the wrapper below is ours.
 *
 * The legacy inline embed (js.hsforms.net/forms/embed/v2.js + hbspt.forms.create),
 * which renders form markup into our own DOM and *would* be styleable, is not an
 * option — HubSpot rejects this form for it:
 *   GET forms.hsforms.com/embed/v3/form/24452375/5d1f9a41-.../json
 *   → 403 "Not an Embed version 2 or 3 form"
 * because it was authored in HubSpot's new form editor.
 *
 * So the form's own fonts, colours, field and button styling have to be set in
 * the HubSpot form editor. The brand values to enter there are the ones used by
 * the in-house wizard: Roboto; text #0E2245; inputs bg #F8FAFC / border #E2E8F0
 * / radius 8px / focus border #30A9DF; button bg #30A9DF (hover #2491C2),
 * white text, radius 8px. Keep the form's own background transparent — the
 * wrapper below already draws the card, and a second one shows as a double edge.
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
      {/* The embed sets an explicit pixel height on this node once the form
          renders and updates it on every step change. min-height only holds the
          card open until then, so it doesn't collapse and jump. */}
      <div
        ref={frameRef}
        className="hs-form-frame min-h-[28rem]"
        data-region={REGION}
        data-form-id={FORM_ID}
        data-portal-id={PORTAL_ID}
      />
    </div>
  )
}
