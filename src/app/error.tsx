'use client'

import { useEffect } from 'react'

/**
 * Replaces the per-page "Couldn't load the page" block the React version
 * rendered when a fetch rejected. Page data is fetched on the server now, so a
 * failed request surfaces here instead.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-lg font-semibold text-navy">Couldn’t load the page</p>
      <p className="text-sm text-navy/60">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Try again
      </button>
    </div>
  )
}
