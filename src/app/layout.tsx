import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Script from 'next/script'
import { fetchSettings } from '@/services/settings'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

/**
 * Self-hosted by Next, replacing the render-blocking fonts.googleapis.com
 * import. Weights match the ones the design actually uses.
 */
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  display: 'swap',
})

const FALLBACK_TITLE = 'RES-DATA'
const FALLBACK_DESCRIPTION =
  'RES-DATA — the data intelligence partner for serious real estate investors. Accurate, verified, and actionable property and owner data.'

/**
 * Site chrome used to be written into <head> by a client effect
 * (the old `DocumentHead`). Next resolves it on the server instead, so the
 * title, description and favicon are in the initial HTML for crawlers.
 */
export async function generateMetadata(): Promise<Metadata> {
  // Never let a settings outage break rendering — the hard-coded chrome below
  // is the same fallback the navbar and footer already use.
  const settings = await fetchSettings().catch(() => null)

  const title = settings?.site_name || FALLBACK_TITLE
  const description = settings?.site_description || FALLBACK_DESCRIPTION

  return {
    title: { default: title, template: `%s | ${title}` },
    description,
    icons: { icon: settings?.site_favicon || '/logo.png' },
    openGraph: { title, description, siteName: title, type: 'website' },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        {/* App Router restores scroll on navigation itself, so the old
            <ScrollToTop /> router effect is no longer needed. */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {/* HubSpot tracking code (portal 24452375 — same portal as the embedded
            forms). HubSpot's install snippet says "just before </body> on every
            page"; in the App Router the root layout is that every-page slot, and
            next/script keeps it to a single load across client-side navigations
            instead of re-executing per route. The `hs-script-loader` id is the
            one HubSpot's own tooling looks for, so it has to stay. */}
        <Script
          id="hs-script-loader"
          src="https://js.hs-scripts.com/24452375.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
