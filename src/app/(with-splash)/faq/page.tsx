import type { Metadata } from 'next'
import PagePlaceholder from '@/components/ui/PagePlaceholder'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions.',
}

export default function FaqPage() {
  return <PagePlaceholder title="FAQ" subtitle="Answers to common questions." />
}
