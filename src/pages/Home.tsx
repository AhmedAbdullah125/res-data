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
          <WinningPatterns section={data.warning_patterns} />
          <HottestData section={data.hottes_data} />
          <Testimonials section={data.testimonials} />
          <MarketAnalysis section={data.market_analysis} />
          <RealMarkets section={data.real_markets} />
          <TeamMembers section={data.team_members} />
          <WhyChoose section={data.category} />
          <CoreValues section={data.over_values} />
          <LeadsLove section={data.leads} />
          <Faqs section={data.faqs} />
          <BannerCta banner={data.banner} />
          <HomePopup />
        </>
      )}
    </>
  )
}
