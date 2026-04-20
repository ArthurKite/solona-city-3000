import { useState } from 'react'
import FranceMap from './components/FranceMap'
import CityModal from './components/CityModal'
import UtilityBar from './components/civic/UtilityBar'
import Masthead from './components/civic/Masthead'
import PrimaryNav from './components/civic/PrimaryNav'
import AlertBanner from './components/civic/AlertBanner'
import RegisterMarquee from './components/civic/RegisterMarquee'
import Intro from './components/civic/Intro'
import InfoRail from './components/civic/InfoRail'
import SiteFooter from './components/civic/SiteFooter'

function App() {
  const [pickedCity, setPickedCity] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  return (
    <div className="paper-grain" style={{ minHeight: '100vh' }}>
      <UtilityBar />
      <Masthead />
      <PrimaryNav />
      <AlertBanner />
      <RegisterMarquee />

      <main
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '40px 24px 24px',
        }}
      >
        <Intro />
        <FranceMap
          onCityPicked={setPickedCity}
          disabled={weatherLoading || !!pickedCity}
        />
        <InfoRail />
      </main>

      <SiteFooter />

      <CityModal
        city={pickedCity}
        onClose={() => setPickedCity(null)}
        onWeatherStateChange={setWeatherLoading}
      />
    </div>
  )
}

export default App
