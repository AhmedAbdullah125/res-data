import { Link } from 'react-router-dom'
import footerLogo from '/footerLogo.png'
import { useSettings } from '../../hooks/useSettings'
import type { SocialLink } from '../../types/settings'
import SocialIcon from './SocialIcon'

/** Used until /api/landing-page/settings answers (and if it never does). */
const FALLBACK_DESCRIPTION =
  'The data intelligence partner for serious real estate investors. Accurate, verified, and actionable property and owner data, so you find opportunities before everyone else.'
const FALLBACK_FOOTER_TEXT = '© 2026 Res-Data Intelligence, Inc. All rights reserved.'
const FALLBACK_SOCIALS: SocialLink[] = [
  { id: -1, platform: 'linkedin', link: 'https://www.linkedin.com', image: null },
  { id: -2, platform: 'twitter', link: 'https://twitter.com', image: null },
  { id: -3, platform: 'youtube', link: 'https://youtube.com', image: null },
  { id: -4, platform: 'email', link: 'mailto:info@res-data.com', image: null },
]

/** "facebook" → "Facebook", for the link's accessible name. */
function platformLabel(platform: string) {
  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

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

export default function Footer() {
  const settings = useSettings()

  const siteName = settings?.site_name || 'RES-DATA'
  const logo = settings?.site_logo || footerLogo
  const description = settings?.site_description || FALLBACK_DESCRIPTION
  const footerText = settings?.footer_text || FALLBACK_FOOTER_TEXT
  const socials = settings?.social_media?.length ? settings.social_media : FALLBACK_SOCIALS

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt={siteName} className="h-10 w-auto" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-300">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={platformLabel(social.platform)}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-slate-300 transition-colors hover:border-brand hover:text-brand"
                >
                  {social.image ? (
                    <img src={social.image} alt="" className="size-4 object-contain" />
                  ) : (
                    <SocialIcon platform={social.platform} />
                  )}
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
          <p className="text-sm text-slate-400">{footerText}</p>
        </div>
      </div>
    </footer>
  )
}
