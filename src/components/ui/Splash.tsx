import { useEffect, useState } from 'react'
import logo from '../../assets/logo.png'

interface SplashProps {
  /** While true the splash covers the screen; when false it animates away. */
  loading: boolean
}

/** Matches the CSS transition duration below (ms) before unmounting. */
const EXIT_MS = 700

/**
 * Full-screen loading splash showing only the logo. When `loading` flips to
 * false it slides down and fades out, then removes itself from the DOM so it
 * never blocks interaction with the revealed page.
 */
export default function Splash({ loading }: SplashProps) {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => setMounted(false), EXIT_MS)
    return () => clearTimeout(timer)
  }, [loading])

  if (!mounted) return null

  return (
    <div
      aria-hidden={!loading}
      className={[
        'fixed inset-0 z-[100] flex items-center justify-center bg-white',
        'transition-all duration-700 ease-in-out',
        loading
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0',
      ].join(' ')}
    >
      <img
        src={logo}
        alt="RES-DATA"
        className="h-16 w-auto animate-pulse select-none sm:h-20"
      />
    </div>
  )
}
