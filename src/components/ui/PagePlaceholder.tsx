type Props = {
  title: string
  subtitle?: string
}

/** Temporary section placeholder — replace with real content per page. */
export default function PagePlaceholder({ title, subtitle }: Props) {
  return (
    <section className="mx-auto flex container flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <span className="rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
        Coming soon
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-navy/60">{subtitle}</p>
      )}
    </section>
  )
}
