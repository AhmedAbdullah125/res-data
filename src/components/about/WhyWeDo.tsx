import type { WhyWeDoSection } from '../../types/about'
import Reveal from '../ui/Reveal'
import RichText from '../ui/RichText'

interface WhyWeDoProps {
  section: WhyWeDoSection
}

export default function WhyWeDo({ section }: WhyWeDoProps) {
  const { header, items } = section

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl lg:text-4xl">
            {header.title}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 120}
              className="rounded-2xl border-l-4 border-brand bg-brand/5 p-6 sm:p-8"
            >
              <RichText className="text-lg leading-relaxed text-navy/80" html={item.description} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
