import { useState } from 'react'
import FranceMap from './components/FranceMap'
import CityModal from './components/CityModal'

function App() {
  const [pickedCity, setPickedCity] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-red-50">
      <h1 className="text-3xl md:text-4xl font-bold mt-8 md:mt-12 text-gray-900">
        Solona City 3000
      </h1>
      <main className="flex-1 w-full max-w-5xl px-3 md:px-4 py-6 md:py-8">
        <FranceMap onCityPicked={setPickedCity} disabled={weatherLoading} />
      </main>
      <footer className="w-full text-center text-xs text-gray-600 py-4">
        Solona City 3000 — Powered by Claude &amp; Open-Meteo
      </footer>
      <CityModal
        city={pickedCity}
        onClose={() => setPickedCity(null)}
        onWeatherStateChange={setWeatherLoading}
      />
    </div>
  )
}

export default App
