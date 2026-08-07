import type { Metadata } from 'next'
import { resolveBlogs } from '@/lib/blogSource'
import Reveal from '@/components/ui/Reveal'
import BlogsExplorer from '@/components/blog/BlogsExplorer'

const DEFAULT_TITLE = 'The RES-DATA Blog'
const DEFAULT_CAPTION =
  'Field notes on real estate data — what makes a list convert, where records go stale, and how to spend outbound hours on people who actually answer.'

export async function generateMetadata(): Promise<Metadata> {
  const { header } = await resolveBlogs()
  return {
    title: header?.title || DEFAULT_TITLE,
    description: header?.caption || DEFAULT_CAPTION,
    alternates: { canonical: '/blogs' },
  }
}

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
  const { blogs, header } = await resolveBlogs()

  return (
    <>
      <section className="relative overflow-hidden bg-[#f3f5f8] py-16 sm:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <h1 className="text-3xl font-medium tracking-tight text-brand sm:text-4xl lg:text-5xl">
              {header?.title || DEFAULT_TITLE}
            </h1>
            <p className="text-[15px] leading-relaxed text-navy">
              {header?.caption || DEFAULT_CAPTION}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <BlogsExplorer blogs={blogs} />
        </div>
      </section>
    </>
  )
}
