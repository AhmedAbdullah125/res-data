import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { getFormLanding } from '../../services/form'
import type { FormIntroHeader } from '../../types/form'
import { useLeadForm } from './useLeadForm'
import WizardBody from './WizardBody'
import RichText from '../ui/RichText'
import VerticalStepper from './VerticalStepper'

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
        className={`flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out md:flex-row ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand sidebar */}
        <aside className="flex shrink-0 flex-col gap-8 bg-brand p-6 text-white md:w-64 ">
          <h2 className="text-2xl font-bold leading-tight tracking-tight">
            {header.title}
          </h2>
          <VerticalStepper current={form.step} />
          <div className="mt-auto flex flex-col gap-2 text-sm text-white/80">
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
        <div className="relative flex-1 overflow-y-auto p-6 md:p-8">
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
