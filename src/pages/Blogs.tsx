import { useMemo, useState } from 'react'
import { useBlogs } from '../hooks/useBlogs'
import Splash from '../components/ui/Splash'
import Reveal from '../components/ui/Reveal'
import BlogCard from '../components/blog/BlogCard'

const ALL = 'all'

export default function Blogs() {
  const { blogs, header, loading } = useBlogs()
  const [category, setCategory] = useState(ALL)

  // Category chips are derived from whatever the posts actually carry, so the
  // filter row stays correct for both API and bundled content.
  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    for (const blog of blogs) {
      if (blog.category) seen.set(blog.category.slug, blog.category.name)
    }
    return [...seen.entries()]
  }, [blogs])

  const visible = useMemo(
    () =>
      category === ALL
        ? blogs
        : blogs.filter((blog) => blog.category?.slug === category),
    [blogs, category],
  )

  const [featured, ...rest] = visible

  return (
    <>
      <Splash loading={loading} />

      <section className="relative overflow-hidden bg-[#f3f5f8] py-16 sm:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <h1 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl lg:text-5xl">
              {header?.title || 'The RES-DATA Blog'}
            </h1>
            <p className="text-[15px] leading-relaxed text-navy">
              {header?.caption ||
                'Field notes on real estate data — what makes a list convert, where records go stale, and how to spend outbound hours on people who actually answer.'}
            </p>
          </Reveal>

          {categories.length > 1 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {[[ALL, 'All posts'] as const, ...categories].map(([slug, name]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setCategory(slug)}
                  aria-pressed={category === slug}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === slug
                      ? 'bg-brand text-white'
                      : 'bg-white text-navy ring-1 ring-slate-200 hover:ring-brand'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          {!loading && !visible.length && (
            <p className="py-10 text-center text-sm text-navy/60">
              No posts in this category yet.
            </p>
          )}

          {featured && (
            <Reveal direction="up">
              <BlogCard blog={featured} featured />
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((blog, i) => (
                <Reveal key={blog.id} delay={Math.min(i, 4) * 60} direction="up">
                  <BlogCard blog={blog} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
