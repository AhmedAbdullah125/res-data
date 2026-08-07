import Splash from '@/components/ui/Splash'

/**
 * The Vite build showed this splash while page data loaded client-side; here it
 * streams instantly while the server renders the route.
 *
 * Scoped to this route group on purpose: a Suspense boundary above
 * /blogs/[slug] would flush the shell before `notFound()` runs, turning a
 * missing article into a soft 404 (HTTP 200).
 */
export default function Loading() {
  return <Splash loading />
}
