import type { Metadata } from 'next'
import { getResultPage } from '@/services/resultPage'
import ProofStats from '@/components/results/ProofStats'
import RealMarkets from '@/components/home/RealMarkets'
import LeadsLove from '@/components/home/LeadsLove'
import BannerCta from '@/components/home/BannerCta'

export const metadata: Metadata = {
  title: 'Results',
  description:
    'Real markets, real deals, real data — the results investors get from RES-DATA records.',
}

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const data = await getResultPage()

  return (
    <>
      <ProofStats hero={data.result_page} />
      <RealMarkets section={data.real_markets} layout="stacked" />
      {!!data.leads?.leads?.length && <LeadsLove section={data.leads} />}
      <BannerCta banner={data.banner} />
    </>
  )
}
