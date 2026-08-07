'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getFormLanding } from '@/services/form'
import type { FormIntroHeader } from '@/types/form'
import { useLeadForm } from '@/components/form/useLeadForm'
import WizardBody from '@/components/form/WizardBody'
import RichText from '@/components/ui/RichText'
import VerticalStepper from '@/components/form/VerticalStepper'

interface LeadFormModalProps {
  onClose: () => void
}

const FALLBACK_HEADER: FormIntroHeader = {
  title: '15 minutes that change how you source deals.',
  caption: '15 min · Video call',
  description: 'No commitment, no pressure',
}

/** Matches the enter/leave transition duration below (ms). */
const ANIM_MS = 300

export default function LeadFormModal({ onClose }: LeadFormModalProps) {
  const form = useLeadForm()
  const [header, setHeader] = useState<FormIntroHeader>(FALLBACK_HEADER)
  const [visible, setVisible] = useState(false)

  // Play the leave animation, then actually unmount.
  const requestClose = useCallback(() => {
    setVisible(false)
    window.setTimeout(onClose, ANIM_MS)
  }, [onClose])

  useEffect(() => {
    // Trigger the enter transition on the next frame.
    const raf = requestAnimationFrame(() => setVisible(true))

    const controller = new AbortController()
    getFormLanding(controller.signal)
      .then((d) => setHeader(d.header1 ?? FALLBACK_HEADER))
      .catch((err) => {
        if (!axios.isCancel(err)) setHeader(FALLBACK_HEADER)
      })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(raf)
      controller.abort()
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
        className={`flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out md:flex-row ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand sidebar — a compact banner above the form on mobile, where
            every pixel it takes is one the form doesn't get. */}
        <aside className="flex shrink-0 flex-col gap-3 bg-brand px-5 py-4 text-white md:w-64 md:gap-8 md:p-6">
          <h2 className="line-clamp-2 text-base font-bold leading-snug tracking-tight md:line-clamp-none md:text-2xl md:leading-tight">
            {header.title}
          </h2>
          <VerticalStepper current={form.step} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80 md:mt-auto md:flex-col md:gap-2 md:text-sm">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {header.caption}
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                <path d="m6 9 1.5 1.5L10.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <RichText as="span" html={header.description} />
            </span>
          </div>
        </aside>

        {/* Step content */}
        <div className="relative flex-1 overflow-y-auto p-5 md:p-8">
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <WizardBody form={form} onDone={requestClose} />
        </div>
      </div>
    </div>
  )
}
