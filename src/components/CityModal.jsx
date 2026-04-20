import { useEffect, useMemo, useRef, useState } from 'react'
import { getWeather } from '../services/weather'
import { getCityInfo } from '../services/cityInfo'
import { buildSlackMessage } from '../services/slackMessage'
import Seal from './civic/Seal'
import WeatherGlyph from './civic/WeatherGlyph'

function MetaCell({ label, value }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 9,
          color: 'var(--muted)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        className="serif"
        style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}
      >
        {value}
      </div>
    </div>
  )
}

function DossierSection({ num, title, action, children }) {
  return (
    <section
      style={{ borderTop: '1px solid var(--line)', padding: '16px 28px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: 'var(--gold)',
              letterSpacing: '0.15em',
            }}
          >
            § {num}
          </span>
          <h3
            className="serif"
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h3>
        </div>
        {action}
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>
        {children}
      </div>
    </section>
  )
}

function DossierSkeleton() {
  return (
    <div style={{ padding: 28 }}>
      <div className="skel" style={{ height: 14, width: '40%', marginBottom: 16 }} />
      <div className="skel" style={{ height: 8, width: '90%', marginBottom: 8 }} />
      <div className="skel" style={{ height: 8, width: '80%', marginBottom: 24 }} />
      <div className="skel" style={{ height: 14, width: '30%', marginBottom: 16 }} />
      <div className="skel" style={{ height: 8, width: '70%', marginBottom: 8 }} />
      <div className="skel" style={{ height: 8, width: '60%', marginBottom: 24 }} />
      <div className="skel" style={{ height: 14, width: '35%', marginBottom: 16 }} />
      <div className="skel" style={{ height: 8, width: '85%' }} />
    </div>
  )
}

function CityModal({ city, onClose, onWeatherStateChange }) {
  const [copied, setCopied] = useState(false)
  const [weather, setWeather] = useState({ status: 'idle', data: null })
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)

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

  useEffect(() => {
    if (!city) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [city, onClose])

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

  const docNo = useMemo(() => {
    if (!city) return ''
    const seed = Math.abs(city.name.charCodeAt(0) * 37)
    return `SOL-3000 / DOS-${String(seed).padStart(4, '0')} / ${new Date().getFullYear()}`
  }, [city])

  if (!city) return null

  const { attraction, funFact } = getCityInfo(city)
  const isLoading = weather.status === 'loading'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slackAnnouncement)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const issued = new Date()
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()

  return (
    <div
      className="anim-fade"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(26,31,54,0.65)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '6vh 20px 20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
    >
      <div
        ref={dialogRef}
        className="dossier anim-drop"
        style={{ width: '100%', maxWidth: 720, position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            width: 32,
            height: 32,
            border: '1px solid var(--ink)',
            background: 'var(--paper-3)',
            cursor: 'pointer',
            fontSize: 16,
            fontFamily: 'inherit',
            color: 'var(--ink)',
          }}
        >
          ✕
        </button>

        {/* Ribbon header */}
        <div
          style={{
            background: 'var(--sovereign)',
            color: 'var(--paper-3)',
            padding: '14px 28px',
            borderBottom: '4px double var(--gold)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ color: 'var(--gold)' }}>
            <Seal size={48} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                opacity: 0.8,
              }}
            >
              Official Designation Dossier
            </div>
            <div
              className="serif"
              style={{
                fontSize: 14,
                fontWeight: 400,
                fontStyle: 'italic',
                opacity: 0.9,
              }}
            >
              Ministère des Villes Aléatoires
            </div>
          </div>
          <div
            className="mono"
            style={{ fontSize: 10, textAlign: 'right', opacity: 0.85 }}
          >
            <div>{docNo}</div>
            <div>ISSUED · {issued}</div>
          </div>
        </div>

        {/* Title block */}
        <div style={{ padding: '28px 28px 18px', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Subject municipality
              </div>
              <h2
                id="city-modal-title"
                className="serif"
                style={{
                  margin: 0,
                  fontSize: 44,
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {city.name}
              </h2>
              <div
                className="serif"
                style={{
                  fontSize: 14,
                  color: 'var(--ink-2)',
                  marginTop: 6,
                  fontStyle: 'italic',
                }}
              >
                {city.region} · Metropolitan France
              </div>
            </div>
            <div className="stamp" style={{ marginTop: 18 }}>
              Certified · Drawn
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 14,
              marginTop: 22,
              borderTop: '1px solid var(--ink)',
              borderBottom: '1px solid var(--ink)',
              padding: '10px 0',
            }}
          >
            <MetaCell
              label="Population"
              value={
                city.population ? city.population.toLocaleString() : '—'
              }
            />
            <MetaCell label="Latitude" value={city.lat.toFixed(4) + '°'} />
            <MetaCell label="Longitude" value={city.lng.toFixed(4) + '°'} />
            <MetaCell label="Status" value="Active" />
          </div>
        </div>

        {isLoading ? (
          <DossierSkeleton />
        ) : (
          <>
            <DossierSection num="I" title="Principal Attraction">
              {attraction}
            </DossierSection>

            <DossierSection num="II" title="Current Atmospheric Conditions">
              {weather.status === 'error' && (
                <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
                  Measurement unavailable at this time.
                </span>
              )}
              {weather.status === 'ready' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--sovereign)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <WeatherGlyph code={weather.data.code} size={44} />
                    <span
                      className="serif"
                      style={{
                        fontSize: 36,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {weather.data.tempC}°
                      <span style={{ fontSize: 20, opacity: 0.7 }}>C</span>
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: '4px 16px',
                      fontSize: 13,
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        color: 'var(--muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontSize: 10,
                      }}
                    >
                      Sky
                    </span>
                    <span>{weather.data.description}</span>
                    <span
                      className="mono"
                      style={{
                        color: 'var(--muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontSize: 10,
                      }}
                    >
                      Wind
                    </span>
                    <span>{weather.data.wind} km/h</span>
                    <span
                      className="mono"
                      style={{
                        color: 'var(--muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontSize: 10,
                      }}
                    >
                      Humidity
                    </span>
                    <span>{weather.data.humidity}%</span>
                  </div>
                </div>
              )}
            </DossierSection>

            <DossierSection num="III" title="Notable Particular">
              <div
                style={{
                  borderLeft: '3px solid var(--gold)',
                  paddingLeft: 14,
                  fontStyle: 'italic',
                  fontFamily: '"Libre Caslon Text", serif',
                  fontSize: 15,
                  color: 'var(--ink)',
                }}
              >
                "{funFact}"
              </div>
            </DossierSection>

            <DossierSection
              num="IV"
              title="Campaign Communiqué"
              action={
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    fontSize: 11,
                    padding: '5px 10px',
                    background: copied ? 'var(--sage)' : 'var(--ink)',
                    color: 'var(--paper-3)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy to clipboard'}
                </button>
              }
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  marginBottom: 8,
                }}
              >
                Model template · for transmission on any communal channel
              </div>
              <pre
                style={{
                  background: 'var(--paper-2)',
                  border: '1px dashed var(--line)',
                  padding: 14,
                  whiteSpace: 'pre-wrap',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: 'var(--ink)',
                  margin: 0,
                }}
              >
                {slackAnnouncement}
              </pre>
            </DossierSection>
          </>
        )}

        {/* Footer */}
        <div
          className="mono"
          style={{
            borderTop: '1px solid var(--ink)',
            background: 'var(--paper-2)',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            fontSize: 11,
            color: 'var(--muted)',
          }}
        >
          <span>
            AUTH · OFFICE OF THE REGISTRAR · {new Date().getFullYear()}
          </span>
          <span>PAGE 01 / 01</span>
          <span style={{ display: 'flex', gap: 14 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.print()
              }}
            >
              Print
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onClose()
              }}
            >
              Close
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CityModal
