import type { SectionHeader } from './api'

/* ---------------------------------------------------------------------------
   Types for the blog endpoints. See docs/BLOGS_BACKEND_SPEC.md for the
   contract these mirror — keep both in sync when the payload changes.
--------------------------------------------------------------------------- */

export interface BlogAuthor {
  id: number
  name: string
  /** Job title shown under the name on the article page. */
  position: string | null
  image: string | null
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
}

/** A post as it appears in listings — no `content`. */
export interface BlogListItem {
  id: number
  /** URL key: /blogs/{slug}. Unique across posts. */
  slug: string
  title: string
  /** Plain-text teaser for cards and meta description. */
  excerpt: string
  image: string | null
  category: BlogCategory | null
  author: BlogAuthor | null
  /** ISO-8601 date. Null while a post is still a draft. */
  published_at: string | null
  /** Backend-computed estimate; the front end falls back to a word count. */
  reading_minutes: number | null
  tags: string[]
}

/** A single post with its rendered body. */
export interface BlogDetail extends BlogListItem {
  /** Sanitized HTML. Headings become the table of contents. */
  content: string
  meta_title: string | null
  meta_description: string | null
}

/** `data` payload of GET /api/landing-page/blogs. */
export interface BlogsListData {
  header: SectionHeader | null
  blogs: BlogListItem[]
}

/** `data` payload of GET /api/landing-page/blogs/{slug}. */
export interface BlogDetailData {
  blog: BlogDetail
  /** Up to three more posts, same category first. */
  related: BlogListItem[]
}
