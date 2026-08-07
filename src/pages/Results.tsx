import { useEffect, useState } from 'react'
import axios from 'axios'
import { getResultPage } from '../services/resultPage'
import type { ResultPageData } from '../types/result'
import Splash from '../components/ui/Splash'
import ProofStats from '../components/results/ProofStats'
import RealMarkets from '../components/home/RealMarkets'
import LeadsLove from '../components/home/LeadsLove'
import BannerCta from '../components/home/BannerCta'

export default function Results() {
  const [data, setData] = useState<ResultPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getResultPage(controller.signal)
      .then(setData)
      .catch((err) => {
        if (axios.isCancel(err)) return
        setError(err instanceof Error ? err.message : 'Failed to load results')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  console.log('Results data:', data?.leads)
  return (
    <>
      <Splash loading={loading} />

      {error && !data && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-lg font-semibold text-navy">Couldn’t load the page</p>
          <p className="text-sm text-navy/60">{error}</p>
        </div>
      )}

      {data && (
        <>
          <ProofStats hero={data.result_page} />
          <RealMarkets section={data.real_markets} layout="stacked" />
          {
            data.leads?.leads.length > 0 &&
          <LeadsLove section={data.leads} />
          }
          <BannerCta banner={data.banner} />
        </>
      )}
    </>
  )
}
