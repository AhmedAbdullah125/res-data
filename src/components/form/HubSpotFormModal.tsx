'use client'

import { useCallback, useEffect, useState } from 'react'
import HubSpotForm from '@/components/form/HubSpotForm'

interface HubSpotFormModalProps {
  onClose: () => void
}

/** Matches the enter/leave transition duration below (ms). */
const ANIM_MS = 300

/**
 * Home-page popup shell around the HubSpot embed — the same form served at
 * /get-started, so both entry points show one identical iframe.
 *
 * Mirrors the overlay/animation/escape-key behaviour of LeadFormModal (the
 * in-house wizard modal), which stays in the codebase for rollback.
 */
export default function HubSpotFormModal({ onClose }: HubSpotFormModalProps) {
  const [visible, setVisible] = useState(false)

  // Play the leave animation, then actually unmount.
  const requestClose = useCallback(() => {
    setVisible(false)
    window.setTimeout(onClose, ANIM_MS)
  }, [onClose])

  useEffect(() => {
    // Trigger the enter transition on the next frame.
    const raf = requestAnimationFrame(() => setVisible(true))

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [requestClose])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      onClick={requestClose}
    >
      <div
        className={`relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-5 pt-14 md:p-8 md:pt-14">
          <HubSpotForm />
        </div>
      </div>
    </div>
  )
}
