/* ---------------------------------------------------------------------------
   Temporary stand-ins for home-page fields the backend hasn't shipped yet.

   Every value here is only used when the API response omits the real field, so
   these constants stop having any effect the moment the endpoints described in
   docs/BACKEND_CHANGES.md go live. Delete this file once they do.
--------------------------------------------------------------------------- */

import type { MotivatedSellerAnnotation } from '@/types/home'

/**
 * Preview a YouTube hero without waiting for the dashboard field: set this to
 * any YouTube URL and it's used whenever `hero.video` / `hero.video_url` are
 * both empty. Left blank so real API data always wins.
 */
export const MOCK_HERO_VIDEO_URL = ''

/**
 * Unannotated property image (`motivated_seller.image_free`). Drop the clean
 * PNG the client supplied at `public/house.png`; if it's missing the section
 * falls back to the old image with the labels baked in.
 */
export const MOCK_SELLER_IMAGE_FREE = '/house.png'

/** Label texts + slots (`motivated_seller.annotations`), matching the design. */
export const MOCK_SELLER_ANNOTATIONS: MotivatedSellerAnnotation[] = [
  { id: -1, title: 'Property type', position: 'top-left' },
  { id: -2, title: 'Owner age', position: 'top-right' },
  { id: -3, title: 'Price range', position: 'middle-left' },
  { id: -4, title: 'Year built', position: 'middle-right' },
  { id: -5, title: 'Distress indicators', position: 'bottom-left' },
  { id: -6, title: 'Equity %', position: 'bottom-right' },
]
