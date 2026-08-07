import { useHomePage } from '../hooks/useHomePage'
import Splash from '../components/ui/Splash'
import Hero from '../components/home/Hero'
import MotivatedSeller from '../components/home/MotivatedSeller'
import WinningPatterns from '../components/home/WinningPatterns'
import HottestData from '../components/home/HottestData'
import Testimonials from '../components/home/Testimonials'
import MarketAnalysis from '../components/home/MarketAnalysis'
import RealMarkets from '../components/home/RealMarkets'
import TeamMembers from '../components/home/TeamMembers'
import WhyChoose from '../components/home/WhyChoose'
import CoreValues from '../components/home/CoreValues'
import LeadsLove from '../components/home/LeadsLove'
import Faqs from '../components/home/Faqs'
import BannerCta from '../components/home/BannerCta'
import HomePopup from '../components/form/HomePopup'
import PoliciesLegal from '../components/common/PoliciesLegal'

export default function Home() {
  const { data, loading, error } = useHomePage()

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
          <Hero hero={data.hero} />
          <MotivatedSeller section={data.motivated_seller} />
          {!!data.warning_patterns?.patterns?.length && (
            <WinningPatterns section={data.warning_patterns} />
          )}
          {!!data.hottes_data?.cards?.length && <HottestData section={data.hottes_data} />}
          {!!data.testimonials?.testimonials?.length && (
            <Testimonials section={data.testimonials} />
          )}
          {!!data.market_analysis?.items?.length && (
            <MarketAnalysis section={data.market_analysis} />
          )}
          {!!data.real_markets?.markets?.length && <RealMarkets section={data.real_markets} />}
          {!!data.team_members?.members?.length && <TeamMembers section={data.team_members} />}
          {!!data.category?.items?.length && <WhyChoose section={data.category} />}
          {!!data.over_values?.values?.length && <CoreValues section={data.over_values} />}
          {!!data.leads?.leads?.length && <LeadsLove section={data.leads} />}
          {!!data.faqs?.faqs?.length && <Faqs section={data.faqs} />}
          <PoliciesLegal />
          <BannerCta banner={data.banner} />
          <HomePopup />
        </>
      )}
    </>
  )
}
