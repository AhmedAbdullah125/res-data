import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSettings } from '../../hooks/useSettings'
import Navbar from './Navbar'
import Footer from './Footer'

/** Scrolls to the top whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * Mirrors the dashboard's site settings into the document head (title, meta
 * description, favicon). index.html keeps sensible defaults for the first
 * paint and for crawlers that don't run JS.
 */
function DocumentHead() {
  const settings = useSettings()

  useEffect(() => {
    if (!settings) return

    if (settings.site_name) document.title = settings.site_name

    if (settings.site_description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = settings.site_description
    }

    if (settings.site_favicon) {
      let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (!icon) {
        icon = document.createElement('link')
        icon.rel = 'icon'
        document.head.appendChild(icon)
      }
      icon.href = settings.site_favicon
    }
  }, [settings])

  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <DocumentHead />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
