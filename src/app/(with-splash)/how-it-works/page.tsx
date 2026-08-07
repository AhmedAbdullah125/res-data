import type { Metadata } from 'next'
import PagePlaceholder from '@/components/ui/PagePlaceholder'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'From raw records to actionable leads.',
}

export default function HowItWorksPage() {
  return <PagePlaceholder title="How It Works" subtitle="From raw records to actionable leads." />
}
