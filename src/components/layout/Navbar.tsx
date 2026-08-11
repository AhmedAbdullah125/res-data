'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SmartImage from '@/components/ui/SmartImage'
import { useSettings } from '@/hooks/useSettings'
import { useScrollToSection } from '@/hooks/useScrollToSection'

/** Bundled logo used until /api/landing-page/settings answers. */
const FALLBACK_LOGO = '/logo.png'

interface NavItem {
  label: string
  href: string
  /** When set, the link smooth-scrolls to this element id on the home page. */
  section?: string
}

const navLinks: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/', section: 'services' },
  { label: 'How It Works', href: '/', section: 'how-it-works' },
  { label: 'Results', href: '/results' },
  { label: 'Blog', href: '/blogs' },
  { label: 'About Us', href: '/about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const settings = useSettings()
  const scrollToSection = useScrollToSection()

  const siteName = settings?.site_name || 'RES-DATA'
  const logo = settings?.site_logo || FALLBACK_LOGO

  /** Home matches exactly; every other link also matches its sub-routes. */
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkClass = (href: string) =>
    [
      'text-[15px] font-medium transition-colors',
      isActive(href) ? 'text-brand' : 'text-navy/80 hover:text-brand',
    ].join(' ')

  const sectionLinkClass = 'text-[15px] font-medium text-navy/80 transition-colors hover:text-brand cursor-pointer'

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-20 container items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${siteName} home`}>
          <SmartImage
            src={logo}
            alt={siteName}
            width={2000}
            height={2000}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.section ? (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => scrollToSection(link.href, link.section!)}
                  className={sectionLinkClass}
                >
                  {link.label}
                </button>
              </li>
            ) : (
              <li key={link.label}>
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/get-started"
          className="hidden rounded-lg bg-brand px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark md:inline-block"
        >
          I Hate Trash Leads
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-navy md:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <ul className="space-y-1 px-4 py-4">
            {navLinks.map((link) =>
              link.section ? (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      scrollToSection(link.href, link.section!)
                    }}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-navy/80 hover:bg-gray-50"
                  >
                    {link.label}
                  </button>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={[
                      'block rounded-md px-3 py-2 text-base font-medium',
                      isActive(link.href)
                        ? 'bg-brand/10 text-brand'
                        : 'text-navy/80 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
            <li className="pt-2">
              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-brand px-5 py-2.5 text-center text-base font-semibold text-white hover:bg-brand-dark"
              >
                I Hate Trash Leads
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
