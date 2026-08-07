import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { resolveBlog } from '@/lib/blogSource'
import {
  estimateReadingMinutes,
  formatPublishedDate,
  parseArticle,
} from '@/lib/articleToc'
import Reveal from '@/components/ui/Reveal'
import BlogCard from '@/components/blog/BlogCard'
import TableOfContents from '@/components/blog/TableOfContents'
import SmartImage from '@/components/ui/SmartImage'

/** Stand-in byline avatar when a post's author has no uploaded image. */
const AUTHOR_FALLBACK_IMAGE = '/logo.png'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const resolved = await resolveBlog(slug)
  if (!resolved) return { title: 'Article not found' }

  const { blog } = resolved
  const title = blog.meta_title || blog.title
  const description = blog.meta_description || blog.excerpt

  return {
    title,
    description,
    alternates: { canonical: `/blogs/${blog.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: blog.published_at ?? undefined,
      authors: blog.author ? [blog.author.name] : undefined,
      tags: blog.tags,
      images: blog.image ? [blog.image] : undefined,
    },
  }
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const resolved = await resolveBlog(slug)
  if (!resolved) notFound()

  const { blog, related } = resolved

  // Heading ids are injected server-side, so the article HTML and the table of
  // contents agree before hydration and the body is crawlable.
  const { html, headings } = parseArticle(blog.content)

  const readingMinutes = blog.reading_minutes ?? estimateReadingMinutes(blog.content)
  const date = formatPublishedDate(blog.published_at)

  return (
    <>
      {/* Article header */}
      <section className="relative overflow-hidden bg-[#f3f5f8] py-12 sm:py-16">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy/60 transition-colors hover:text-brand"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path
                d="M12.667 8H3.333M7.333 12l-4-4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All articles
          </Link>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-navy/50">
              {blog.category && (
                <span className="rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
                  {blog.category.name}
                </span>
              )}
              {date && <span>{date}</span>}
              {readingMinutes && <span>{readingMinutes} min read</span>}
            </div>

            <h1 className="mt-4 text-3xl font-medium leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-navy/60">{blog.excerpt}</p>

            {blog.author && (
              <div className="mt-6 flex items-center gap-3">
                <SmartImage
                  src={blog.author.image || AUTHOR_FALLBACK_IMAGE}
                  alt=""
                  width={40}
                  height={40}
                  className={
                    blog.author.image
                      ? 'size-10 rounded-full object-cover'
                      : // The brand mark is a wide wordmark, so pad it inside
                        // the circle instead of cropping it to fill.
                        'size-10 rounded-full bg-white object-contain p-1.5 ring-1 ring-slate-200'
                  }
                />
                <div className="text-sm">
                  <p className="font-medium text-navy">{blog.author.name}</p>
                  {blog.author.position && (
                    <p className="text-navy/50">{blog.author.position}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {blog.image && (
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg sm:-mt-10">
            <SmartImage
              src={blog.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Body + table of contents */}
      <section className="relative py-12 sm:py-16">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            <article
              className="blog-prose min-w-0"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {headings.length > 0 && (
              <aside className="order-first lg:order-last">
                <div className="lg:sticky lg:top-28">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}
          </div>

          {blog.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-slate-200 pt-8">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f3f5f8] px-3 py-1 text-xs text-navy/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden pb-16 sm:pb-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <Reveal className="rounded-3xl bg-navy px-8 py-12 text-center sm:px-14">
            <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Want this run against your own market?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
              Get a custom market analysis built on RES-DATA records — free, and
              specific to the ZIPs you actually work.
            </p>
            <Link
              href="/get-started"
              className="mt-7 inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Get my market analysis
            </Link>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative overflow-hidden bg-[#f3f5f8] py-14 sm:py-20">
          <div className="mx-auto container px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-medium tracking-tight text-brand sm:text-3xl">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 4) * 60} direction="up">
                  <BlogCard blog={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
