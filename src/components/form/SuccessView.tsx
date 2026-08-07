'use client'

import Link from 'next/link'

interface SuccessViewProps {
  message: string
  /** When provided (popup context), render a close button instead of a link. */
  onClose?: () => void
}

export default function SuccessView({ message, onClose }: SuccessViewProps) {
  return (
    <div className="animate-step flex flex-col items-center gap-5 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand/15 text-brand">
        <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden="true">
          <path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <h2 className="text-2xl font-semibold text-navy">You’re booked!</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{message}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Done
        </button>
      ) : (
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Back to home
        </Link>
      )}
    </div>
  )
}
