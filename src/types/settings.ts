/* ---------------------------------------------------------------------------
   Types for GET /api/landing-page/settings — global site chrome.
--------------------------------------------------------------------------- */

/** Platforms the dashboard offers. Unknown values fall back to a link icon. */
export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'snapchat'

export interface SocialLink {
  id: number
  /** Typed loosely: the backend may add platforms before the front end knows them. */
  platform: SocialPlatform | string
  link: string
  /** Custom icon uploaded in the dashboard; falls back to the built-in glyph. */
  image: string | null
}

/** `data` payload of GET /api/landing-page/settings. */
export interface SiteSettings {
  site_name: string | null
  site_logo: string | null
  site_favicon: string | null
  site_description: string | null
  footer_text: string | null
  social_media: SocialLink[]
}
