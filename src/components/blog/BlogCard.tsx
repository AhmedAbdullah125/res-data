import Link from 'next/link'
import type { BlogListItem } from '@/types/blog'
import { formatPublishedDate } from '@/lib/articleToc'
import SmartImage from '@/components/ui/SmartImage'

interface BlogCardProps {
  blog: BlogListItem
  /** Wider treatment used for the lead post on the index. */
  featured?: boolean
}

/** Initials stand in for the cover image until the dashboard supplies one. */
function CoverFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-navy">
      <span className="text-5xl font-bold text-white/15">
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const date = formatPublishedDate(blog.published_at)

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg ${
        featured ? 'sm:grid sm:grid-cols-2' : 'flex flex-col'
      }`}
    >
      <Link
        href={`/blogs/${blog.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block overflow-hidden ${
          featured ? 'h-full min-h-56' : 'h-48'
        }`}
      >
        {blog.image ? (
          <SmartImage
            src={blog.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CoverFallback title={blog.title} />
        )}
      </Link>

      <div className={`flex flex-1 flex-col p-6 ${featured ? 'sm:p-8' : ''}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy/50">
          {blog.category && (
            <span className="rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
              {blog.category.name}
            </span>
          )}
          {date && <span>{date}</span>}
          {blog.reading_minutes && <span>{blog.reading_minutes} min read</span>}
        </div>

        <h3
          className={`mt-3 font-medium leading-snug text-navy ${
            featured ? 'text-2xl sm:text-3xl' : 'text-lg'
          }`}
        >
          <Link
            href={`/blogs/${blog.slug}`}
            className="transition-colors hover:text-brand focus-visible:outline-none focus-visible:text-brand"
          >
            {blog.title}
          </Link>
        </h3>

        <p
          className={`mt-3 flex-1 text-sm leading-relaxed text-navy/60 ${
            featured ? '' : 'line-clamp-3'
          }`}
        >
          {blog.excerpt}
        </p>

        <Link
          href={`/blogs/${blog.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-dark"
        >
          Read article
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M3.333 8h9.334M8.667 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}
