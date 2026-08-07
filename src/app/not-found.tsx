import Link from 'next/link'

/** Replaces the React Router `path="*"` placeholder route. */
export default function NotFound() {
  return (
    <section className="mx-auto flex container flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <span className="rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
        404
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-navy/60">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Back to home
      </Link>
    </section>
  )
}
