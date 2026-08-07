import type { Metadata } from 'next'
import PagePlaceholder from '@/components/ui/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Talk to Us',
  description: 'Tell us about your market and lead problems.',
}

export default function ContactPage() {
  return <PagePlaceholder title="Talk to Us" subtitle="Tell us about your market and lead problems." />
}
