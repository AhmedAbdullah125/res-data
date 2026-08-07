import type { WhyWeDoSection } from '@/types/about'
import Reveal from '@/components/ui/Reveal'
import RichText from '@/components/ui/RichText'

interface WhyWeDoProps {
  section: WhyWeDoSection
}

export default function WhyWeDo({ section }: WhyWeDoProps) {
  const { header, items } = section

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {header.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-10 sm:mt-20 sm:grid-cols-2 sm:gap-12 lg:gap-16">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 120} className="flex gap-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-1 size-6 shrink-0 text-brand"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
              </svg>
              <RichText className="text-lg leading-relaxed text-navy/70" html={item.description} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
