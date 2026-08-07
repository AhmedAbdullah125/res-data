import type { Metadata } from 'next'
import PagePlaceholder from '@/components/ui/PagePlaceholder'

export const metadata: Metadata = {
  title: 'Services',
  description: 'What RES-DATA does for your pipeline.',
}

export default function ServicesPage() {
  return <PagePlaceholder title="Services" subtitle="What RES-DATA does for your pipeline." />
}
