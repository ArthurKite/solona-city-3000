import { useEffect, useMemo, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { motion } from 'framer-motion'
import { pickRandomCity } from '../services/cityPicker'

const GEO_URL =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson'
const WIDTH = 600
const HEIGHT = 700

function FranceMap({ onCityPicked }) {
  const [geoData, setGeoData] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [dart, setDart] = useState(null)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (!cancelled) setGeoData(data)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const projection = useMemo(() => {
    if (!geoData) return null
    return geoMercator().fitSize([WIDTH, HEIGHT], geoData)
  }, [geoData])

  const pathGen = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  )

  const handleThrow = () => {
    if (!projection || animating) return
    const city = pickRandomCity()
    setAnimating(true)
    setDart({ city, throwId: Date.now() })
  }

  const target =
    dart && projection ? projection([dart.city.lng, dart.city.lat]) : null

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div
        className="w-full flex items-center justify-center"
        style={{ height: '70vh' }}
      >
        {loadError && (
          <p className="text-red-600">Map failed to load: {loadError}</p>
        )}
        {!loadError && (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full overflow-visible"
          >
            {pathGen &&
              geoData.features.map((feature, i) => (
                <path
                  key={feature.properties?.code ?? i}
                  d={pathGen(feature)}
                  fill="#dbeafe"
                  stroke="#60a5fa"
                  strokeWidth={0.5}
                />
              ))}
            {dart && target && (
              <motion.text
                key={dart.throwId}
                x={target[0]}
                initial={{ y: -80 }}
                animate={{ y: target[1] }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.6, 1] }}
                onAnimationComplete={() => {
                  setAnimating(false)
                  onCityPicked(dart.city)
                }}
                fontSize={32}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ userSelect: 'none' }}
              >
                🎯
              </motion.text>
            )}
          </svg>
        )}
      </div>
      <button
        type="button"
        onClick={handleThrow}
        disabled={!projection || animating}
        className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🎯 Throw the dart
      </button>
    </div>
  )
}

export default FranceMap
