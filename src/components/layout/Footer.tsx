import { Link } from 'react-router-dom'
import footerLogo from '/footerLogo.png'

const marketLinks = [
  { label: 'Deduplicated', to: '/services' },
  { label: 'Updated Daily', to: '/services' },
  { label: 'For Your Market', to: '/services' },
  { label: 'With Meticulous Support', to: '/services' },
]

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Form', to: '/contact' },
  { label: 'Services', to: '/services' },
]

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    icon: (
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.02 8h4.96v16H.02V8zM8.98 8h4.75v2.19h.07c.66-1.25 2.27-2.57 4.67-2.57 5 0 5.92 3.29 5.92 7.57V24h-4.96v-7.07c0-1.69-.03-3.86-2.35-3.86-2.35 0-2.71 1.84-2.71 3.74V24H8.98V8z" />
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <path d="M23.95 4.57c-.88.39-1.83.65-2.83.77 1.02-.61 1.8-1.58 2.17-2.73-.95.56-2.01.97-3.13 1.19-.9-.96-2.18-1.56-3.6-1.56-2.72 0-4.93 2.21-4.93 4.93 0 .39.04.76.13 1.12-4.1-.21-7.73-2.17-10.16-5.16-.42.73-.67 1.58-.67 2.48 0 1.71.87 3.22 2.19 4.1-.81-.03-1.57-.25-2.23-.62v.06c0 2.39 1.7 4.38 3.95 4.83-.41.11-.85.17-1.3.17-.32 0-.63-.03-.93-.09.63 1.96 2.45 3.39 4.6 3.43-1.68 1.32-3.81 2.11-6.12 2.11-.4 0-.79-.02-1.18-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.43-.02-.64.96-.69 1.8-1.56 2.46-2.55z" />
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.89.5-5.8.5-5.8s0-3.91-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    ),
  },
  {
    label: 'Email',
    href: 'mailto:info@res-data.com',
    icon: (
      <path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 7.5L3.5 6v.5L12 12l8.5-5.5V6L12 11.5z" />
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={footerLogo} alt="RES-DATA" className="h-10 w-auto" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-300">
              The data intelligence partner for serious real estate investors.
              Accurate, verified, and actionable property and owner data, so you
              find opportunities before everyone else.
            </p>
            <div className="mt-8 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-slate-300 transition-colors hover:border-brand hover:text-brand"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Data for your market */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand">
              Data For Your Market
            </h3>
            <ul className="mt-6 space-y-4">
              {marketLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-200 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand">
              Company
            </h3>
            <ul className="mt-6 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-200 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-slate-400">
            © 2026 Res-Data Intelligence, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
