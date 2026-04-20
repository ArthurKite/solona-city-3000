import { useState } from 'react'

function Section({ icon, heading, action, children }) {
  return (
    <section className="border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {heading}
        </h3>
        {action}
      </div>
      <div className="text-gray-600">{children}</div>
    </section>
  )
}

function CityModal({ city, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!city) return null

  const slackAnnouncement = 'Loading...'

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
        className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 flex items-center justify-center text-xl leading-none"
        >
          ✕
        </button>

        <header className="pr-10">
          <h2 id="city-modal-title" className="text-3xl font-bold text-gray-900">
            {city.name}
          </h2>
          <p className="text-gray-500 mt-1">{city.region}</p>
        </header>

        <Section icon="🏛️" heading="Main tourist attraction">
          Loading...
        </Section>

        <Section icon="☀️" heading="Current weather">
          Loading...
        </Section>

        <Section icon="💡" heading="Fun fact">
          Loading...
        </Section>

        <Section
          icon="📣"
          heading="Slack announcement"
          action={
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-95 transition"
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          }
        >
          {slackAnnouncement}
        </Section>
      </div>
    </div>
  )
}

export default CityModal
