import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { getWeather } from '../services/weather'
import { getCityInfo } from '../services/cityInfo'
import { buildSlackMessage } from '../services/slackMessage'

function Section({ icon, heading, action, children }) {
  return (
    <section className="border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {heading}
        </h3>
        {action}
      </div>
      <div className="text-gray-700">{children}</div>
    </section>
  )
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="border-t border-gray-200 pt-4 space-y-2">
          <div className="h-3 w-1/3 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

function fireConfetti() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return
  }
  confetti({
    particleCount: 80,
    spread: 60,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.3 },
    scalar: 0.9,
  })
}

function CityModal({ city, onClose, onWeatherStateChange }) {
  const [copied, setCopied] = useState(false)
  const [weather, setWeather] = useState({ status: 'idle', data: null })
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

  // --- Weather fetch + parent loading notification ---
  useEffect(() => {
    if (!city) {
      onWeatherStateChange?.(false)
      return
    }
    let cancelled = false
    setWeather({ status: 'loading', data: null })
    onWeatherStateChange?.(true)
    getWeather(city.lat, city.lng)
      .then((data) => {
        if (!cancelled) {
          setWeather({ status: 'ready', data })
          onWeatherStateChange?.(false)
        }
      })
      .catch((err) => {
        console.error('Weather fetch failed', err)
        if (!cancelled) {
          setWeather({ status: 'error', data: null })
          onWeatherStateChange?.(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [city, onWeatherStateChange])

  // --- Confetti on open ---
  useEffect(() => {
    if (city) fireConfetti()
  }, [city])

  // --- Escape closes the modal ---
  useEffect(() => {
    if (!city) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [city, onClose])

  // --- Focus management: store previous, focus first element, restore on close ---
  useEffect(() => {
    if (!city) return
    previouslyFocused.current = document.activeElement
    const firstButton = dialogRef.current?.querySelector('button')
    firstButton?.focus()
    const restoreTo = previouslyFocused.current
    return () => {
      if (restoreTo && typeof restoreTo.focus === 'function') restoreTo.focus()
    }
  }, [city])

  // --- Tab focus trap inside dialog ---
  useEffect(() => {
    if (!city) return
    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const node = dialogRef.current
      if (!node) return
      const focusables = node.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [city])

  const slackAnnouncement = useMemo(
    () => (city ? buildSlackMessage(city) : ''),
    [city],
  )

  if (!city) return null

  const { attraction, funFact } = getCityInfo(city)
  const isLoading = weather.status === 'loading'

  let weatherContent
  if (weather.status === 'error') {
    weatherContent = (
      <span className="text-gray-600 italic">Weather unavailable</span>
    )
  } else if (weather.status === 'ready') {
    weatherContent = `${weather.data.tempC}°C — ${weather.data.description}`
  } else {
    weatherContent = null
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slackAnnouncement)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
    >
      <div
        ref={dialogRef}
        className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-4 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center text-xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ✕
        </button>

        <header className="pr-10">
          <h2
            id="city-modal-title"
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            {city.name}
          </h2>
          <p className="text-gray-600 mt-1">{city.region}</p>
        </header>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <Section icon="🏛️" heading="Main tourist attraction">
              {attraction}
            </Section>

            <Section icon="☀️" heading="Current weather">
              {weatherContent}
            </Section>

            <Section icon="💡" heading="Fun fact">
              {funFact}
            </Section>

            <Section
              icon="📣"
              heading="Slack announcement"
              action={
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
              }
            >
              <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm bg-gray-50 p-3 rounded-md text-gray-800">
                {slackAnnouncement}
              </pre>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}

export default CityModal
