import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBlog } from '../hooks/useBlog'
import {
  estimateReadingMinutes,
  formatPublishedDate,
  parseArticle,
} from '../lib/articleToc'
import Splash from '../components/ui/Splash'
import Reveal from '../components/ui/Reveal'
import BlogCard from '../components/blog/BlogCard'
import TableOfContents from '../components/blog/TableOfContents'

/** Stand-in byline avatar when a post's author has no uploaded image. */
const AUTHOR_FALLBACK_IMAGE = '/logo.png'

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { blog, related, loading, notFound } = useBlog(slug)

  // Rewrites the body HTML with heading ids and hands back the TOC entries.
  const { html, headings } = useMemo(
    () => (blog ? parseArticle(blog.content) : { html: '', headings: [] }),
    [blog],
  )

  // The title lives in the article, not the shared settings, so set it here.
  useEffect(() => {
    if (!blog) return
    const previous = document.title
    document.title = blog.meta_title || blog.title
    return () => {
      document.title = previous
    }
  }, [blog])

  const readingMinutes =
    blog?.reading_minutes ?? (blog ? estimateReadingMinutes(blog.content) : null)
  const date = formatPublishedDate(blog?.published_at ?? null)

  if (notFound && !loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-lg font-semibold text-navy">Article not found</p>
        <p className="text-sm text-navy/60">
          This post may have been moved or unpublished.
        </p>
        <Link
          to="/blogs"
          className="mt-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Back to all articles
        </Link>
      </div>
    )
  }

  return (
    <>
      <Splash loading={loading} />

      {blog && (
        <>
          {/* Article header */}
          <section className="relative overflow-hidden bg-[#f3f5f8] py-12 sm:py-16">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
              <Link
                to="/blogs"
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
                <p className="mt-4 text-base leading-relaxed text-navy/60">
                  {blog.excerpt}
                </p>

                {blog.author && (
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={blog.author.image || AUTHOR_FALLBACK_IMAGE}
                      alt=""
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
              <img
                src={blog.image}
                alt=""
                className="-mt-8 w-full rounded-2xl object-cover shadow-lg sm:-mt-10"
              />
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
                  Get a custom market analysis built on RES-DATA records — free,
                  and specific to the ZIPs you actually work.
                </p>
                <Link
                  to="/get-started"
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
      )}
    </>
  )
}
