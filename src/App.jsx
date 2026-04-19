import { useState } from 'react'
import FranceMap from './components/FranceMap'
import CityModal from './components/CityModal'

function App() {
  const [pickedCity, setPickedCity] = useState(null)

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-4xl font-bold mt-12 text-gray-900">
        Solona City 3000
      </h1>
      <main className="flex-1 w-full max-w-5xl px-4 py-8">
        <FranceMap onCityPicked={setPickedCity} />
      </main>
      <CityModal city={pickedCity} onClose={() => setPickedCity(null)} />
    </div>
  )
}

export default App
