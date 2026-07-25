/** Standard envelope every RES-DATA endpoint returns. */
export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
  errors: unknown[]
}

/**
 * Header block reused across most landing-page sections.
 * `caption`, `description`, and `button_text` are frequently null.
 */
export interface SectionHeader {
  id: number
  title: string
  caption: string | null
  description: string | null
  button_text: string | null
}

/** A labelled figure (e.g. "300+" / "Clients"). Shared by hero + markets. */
export interface Statistic {
  id: number
  number: string
  name: string
}
