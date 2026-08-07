import type { Metadata } from 'next'
import GetStartedView from '@/components/form/GetStartedView'

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Book a 15-minute pipeline acceleration call and see the deals your competitors are missing.',
}

/**
 * The wizard's data is fetched client-side on purpose: every form request
 * carries an `X-Visitor-Id` header read from localStorage, which scopes the
 * three-step booking session. Fetching on the server would mint a new visitor
 * per request and break the flow.
 */
export default function GetStartedPage() {
  return <GetStartedView />
}
