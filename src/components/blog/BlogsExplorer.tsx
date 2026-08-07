'use client'

import { useMemo, useState } from 'react'
import type { BlogListItem } from '@/types/blog'
import Reveal from '@/components/ui/Reveal'
import BlogCard from '@/components/blog/BlogCard'

const ALL = 'all'

/**
 * Client half of the blog index: the category chips and the filtered grid.
 * The posts themselves are fetched and rendered by the server page.
 */
export default function BlogsExplorer({ blogs }: { blogs: BlogListItem[] }) {
  const [category, setCategory] = useState(ALL)

  // Chips are derived from whatever the posts actually carry, so the filter
  // row stays correct for both API and bundled content.
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

      <div className="mt-14">
        {!visible.length && (
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
    </>
  )
}
