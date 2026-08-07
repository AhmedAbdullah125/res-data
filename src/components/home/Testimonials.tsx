import type { TestimonialsSection } from '@/types/home'
import Reveal from '@/components/ui/Reveal'
import SmartImage from '@/components/ui/SmartImage'
import RichText from '@/components/ui/RichText'

interface TestimonialsProps {
  section: TestimonialsSection
}

/** Five stars, the first `rate` filled amber, the rest muted grey. */
function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`size-4 ${i < rate ? 'fill-amber-400' : 'fill-slate-300'}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.472 5.008 5.528.803-4 3.898.944 5.506L10 14.116l-4.944 2.599.944-5.506-4-3.898 5.528-.803L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

/** Avatar image when present, otherwise the person's initials. */
function Avatar({ src, name }: { src: string | null; name: string }) {
  if (src) {
    return (
      <SmartImage
        src={src}
        alt={name}
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full bg-slate-100 object-cover"
      />
    )
  }

  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600">
      {initials}
    </div>
  )
}

export default function Testimonials({ section }: TestimonialsProps) {
  const { header, testimonials } = section

  return (
    <section className="relative overflow-hidden bg-slate-50/60 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header (left-aligned) */}
        <Reveal className="flex max-w-3xl flex-col gap-3">
          <h2 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl">
            {header.title}
          </h2>
          {header.caption && (
            <p className="text-lg text-slate-600 sm:text-xl">{header.caption}</p>
          )}
        </Reveal>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.id}
              delay={i * 120}
              className="flex h-full flex-col rounded-2xl border-2 border-slate-900/10 bg-white p-7 sm:p-8"
            >
              <StarRating rate={t.rate} />

              <RichText
                className="flex-1 pt-4 text-[15px] leading-relaxed text-[rgba(10,16,32,0.85)]"
                html={`“${t.description}”`}
              />

              <div className="flex items-center gap-3 pt-6">
                <Avatar src={t.image} name={t.name} />
                <div>
                  <p className="text-sm font-medium text-brand">{t.name}</p>
                  <p className="text-xs text-[#5b6577]">{t.caption}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
