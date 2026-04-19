import FranceMap from './components/FranceMap'

function App() {
  const handleCityPicked = (city) => {
    console.log('Picked city:', city)
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <h1 className="text-4xl font-bold mt-12 text-gray-900">
        Solona City 3000
      </h1>
      <main className="flex-1 w-full max-w-5xl px-4 py-8">
        <FranceMap onCityPicked={handleCityPicked} />
      </main>
    </div>
  )
}

export default App
