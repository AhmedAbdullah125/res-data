'use client'

import Reveal from '@/components/ui/Reveal'

/** Download-to-tray glyph shown on both buttons. */
function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  )
}

interface LegalDocument {
  label: string
  href: string
  /** Saved filename for the download. */
  fileName: string
  primary: boolean
}

const documents: LegalDocument[] = [
  {
    label: ' Privacy Policy',
    href: '/privacy-policy.pdf',
    fileName: 'privacy-policy.pdf',
    primary: true,
  },
  {
    label: ' Terms & Conditions',
    href: '/terms-conditions.pdf',
    fileName: 'terms-conditions.pdf',
    primary: false,
  },
]

/**
 * Saves the file to disk. The anchor's own `target="_blank"` handles opening
 * the preview tab — a single anchor can't do both, because a `download`
 * attribute suppresses the navigation, so the save is driven from here.
 */
function saveToDisk(doc: LegalDocument) {
  const link = document.createElement('a')
  link.href = doc.href
  link.download = doc.fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Static legal section — the copy and the two PDFs ship with the front end
 * rather than coming from the dashboard. Rendered on both Home and About.
 */
export default function PoliciesLegal() {
  return (
    <section
      id="policies"
      className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <Reveal
          className="rounded-3xl bg-[#f3f5f8] px-8 py-12 sm:px-14 sm:py-16"
          direction="up"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl">
              Policies &amp; Legal Information
            </h2>
            <p className="text-[15px] leading-relaxed text-navy">
              At RES-VA, we value transparency and responsible communication.
              Please review our policies to understand how we handle your
              information and how our messaging program works.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {documents.map((doc) => (
                <a
                  key={doc.fileName}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => saveToDisk(doc)}
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                    doc.primary
                      ? 'bg-brand text-white shadow-sm hover:bg-brand-dark'
                      : 'border-2 border-navy/15 text-navy hover:border-brand hover:text-brand'
                  }`}
                >
                  {/* <DownloadIcon /> */}
                  {doc.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
