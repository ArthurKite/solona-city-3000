import { useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { pickRandomCity } from '../services/cityPicker'
import cities from '../data/frenchCities.json'

const GEO_URL =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements.geojson'
const W = 560
const H = 620

function Stat({ label, value }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: 'var(--muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        className="serif"
        style={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.1,
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function FranceMap({ onCityPicked, disabled = false }) {
  const [geo, setGeo] = useState(null)
  const [err, setErr] = useState(null)
  const [dart, setDart] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [hoveredDept, setHoveredDept] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [previewCity, setPreviewCity] = useState(null)
  const drawsTodayRef = useRef(
    (Math.floor(Math.random() * 900) + 100).toLocaleString(),
  )

  useEffect(() => {
    let cancelled = false
    fetch(GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (!cancelled) setGeo(data)
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const projection = useMemo(() => {
    if (!geo) return null
    return geoMercator().fitSize([W, H], geo)
  }, [geo])

  const pathGen = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection],
  )

  const target =
    dart && projection ? projection([dart.city.lng, dart.city.lat]) : null

  // scanner effect — flicker random city dots while scanning
  useEffect(() => {
    if (!scanning) return
    const id = setInterval(() => {
      setPreviewCity(cities[Math.floor(Math.random() * cities.length)])
    }, 50)
    return () => clearInterval(id)
  }, [scanning])

  const handleDraw = () => {
    if (!projection || animating || disabled) return
    setAnimating(true)
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      const city = pickRandomCity()
      setPreviewCity(city)
      const id = Date.now()
      setDart({ city, id })
      // SMIL dart drop runs for ~800ms; fire onPicked after it lands
      setTimeout(() => {
        setAnimating(false)
        onCityPicked(city)
      }, 850)
    }, 1200)
  }

  const regionsCovered = useMemo(
    () => new Set(cities.map((c) => c.region)).size,
    [],
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 28,
        alignItems: 'start',
      }}
    >
      {/* Map panel */}
      <div
        style={{
          background: 'var(--paper-3)',
          border: '1px solid var(--ink)',
          boxShadow: '0 2px 0 var(--ink)',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid var(--ink)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--paper-2)',
          }}
        >
          <span
            style={{
              background: 'var(--ink)',
              color: 'var(--paper-3)',
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Form A-3
          </span>
          <span className="serif" style={{ fontSize: 17, fontWeight: 700 }}>
            Cartographic Designation Panel
          </span>
          <span style={{ flex: 1 }} />
          <span
            className="mono"
            style={{ fontSize: 11, color: 'var(--muted)' }}
          >
            GEO · metropolitan · 1:5,500,000
          </span>
        </div>

        <div style={{ position: 'relative', padding: 20 }}>
          {err && (
            <p style={{ color: 'var(--vermillion)' }}>
              Map failed to load: {err}
            </p>
          )}
          {!err && !geo && (
            <div
              className="mono"
              style={{
                height: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)',
              }}
            >
              Loading cartographic data…
            </div>
          )}
          {pathGen && geo && (
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="var(--line-2)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width={W} height={H} fill="url(#grid)" />

              {/* corner ticks */}
              {[
                [0, 0],
                [W, 0],
                [0, H],
                [W, H],
              ].map(([x, y], i) => (
                <g key={i} stroke="var(--ink)" strokeWidth="1">
                  <line x1={x} y1={y} x2={x + (x === 0 ? 14 : -14)} y2={y} />
                  <line x1={x} y1={y} x2={x} y2={y + (y === 0 ? 14 : -14)} />
                </g>
              ))}

              {geo.features.map((f, i) => (
                <path
                  key={f.properties?.code ?? i}
                  d={pathGen(f)}
                  className={`dept-path ${hoveredDept === i ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredDept(i)}
                  onMouseLeave={() => setHoveredDept(null)}
                />
              ))}

              {/* scan flicker */}
              {scanning && previewCity && projection && (
                <circle
                  cx={projection([previewCity.lng, previewCity.lat])[0]}
                  cy={projection([previewCity.lng, previewCity.lat])[1]}
                  r="4"
                  fill="var(--vermillion)"
                  opacity="0.7"
                />
              )}

              {/* dart landing */}
              {dart && target && (
                <g key={dart.id}>
                  <circle
                    cx={target[0]}
                    cy={target[1]}
                    r="1"
                    fill="none"
                    stroke="var(--vermillion)"
                    strokeWidth="2"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="30"
                      dur="1s"
                      begin="0.7s"
                      repeatCount="1"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.9"
                      to="0"
                      dur="1s"
                      begin="0.7s"
                      repeatCount="1"
                    />
                  </circle>
                  <circle
                    cx={target[0]}
                    cy={target[1]}
                    r="1"
                    fill="none"
                    stroke="var(--vermillion)"
                    strokeWidth="1.5"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="40"
                      dur="1.2s"
                      begin="0.9s"
                      repeatCount="1"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.7"
                      to="0"
                      dur="1.2s"
                      begin="0.9s"
                      repeatCount="1"
                    />
                  </circle>
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      from={`${target[0]} -200`}
                      to={`${target[0]} ${target[1]}`}
                      dur="0.8s"
                      begin="0s"
                      fill="freeze"
                      keyTimes="0;0.85;1"
                      values={`${target[0]} -200; ${target[0]} ${target[1] + 3}; ${target[0]} ${target[1]}`}
                    />
                    <circle
                      r="14"
                      fill="none"
                      stroke="var(--vermillion)"
                      strokeWidth="1.2"
                    />
                    <circle
                      r="7"
                      fill="none"
                      stroke="var(--vermillion)"
                      strokeWidth="1"
                    />
                    <circle r="2" fill="var(--vermillion)" />
                    <line
                      x1="-20"
                      y1="0"
                      x2="-16"
                      y2="0"
                      stroke="var(--vermillion)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="16"
                      y1="0"
                      x2="20"
                      y2="0"
                      stroke="var(--vermillion)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="0"
                      y1="-20"
                      x2="0"
                      y2="-16"
                      stroke="var(--vermillion)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="0"
                      y1="16"
                      x2="0"
                      y2="20"
                      stroke="var(--vermillion)"
                      strokeWidth="1.5"
                    />
                  </g>
                  <g transform={`translate(${target[0] + 24} ${target[1] - 8})`}>
                    <rect
                      x="0"
                      y="-14"
                      width={dart.city.name.length * 7.2 + 20}
                      height="22"
                      fill="var(--ink)"
                      opacity="0.95"
                    />
                    <text
                      x="10"
                      y="1"
                      fontSize="11"
                      fill="var(--paper-3)"
                      fontFamily="JetBrains Mono"
                      fontWeight="500"
                    >
                      {dart.city.name.toUpperCase()}
                    </text>
                  </g>
                </g>
              )}
            </svg>
          )}
          <div
            className="mono"
            style={{
              display: 'flex',
              gap: 18,
              marginTop: 10,
              fontSize: 11,
              color: 'var(--muted)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  background: 'var(--paper-3)',
                  border: '1px solid var(--ink)',
                }}
              />{' '}
              Department
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  background: '#dfe7f4',
                  border: '1px solid var(--ink)',
                }}
              />{' '}
              Hovered
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  border: '1.5px solid var(--vermillion)',
                  borderRadius: '50%',
                }}
              />{' '}
              Designation point
            </div>
            <span style={{ flex: 1 }} />
            <span>Data: Ministry Cartography Division</span>
          </div>
        </div>
      </div>

      {/* Right-hand sidebar */}
      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          position: 'sticky',
          top: 12,
        }}
      >
        <div
          style={{
            background: 'var(--paper-3)',
            border: '1px solid var(--ink)',
            padding: 18,
            boxShadow: '0 2px 0 var(--ink)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                background: 'var(--sovereign)',
                color: 'var(--paper-3)',
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Procedure
            </span>
            <span
              className="mono"
              style={{ fontSize: 10, color: 'var(--muted)' }}
            >
              § 14.2.c
            </span>
          </div>
          <h3
            className="serif"
            style={{ margin: '0 0 8px', fontSize: 20, lineHeight: 1.2 }}
          >
            Randomised Civic Designation
          </h3>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: 13,
              color: 'var(--ink-2)',
            }}
          >
            Pursuant to Ministerial Order{' '}
            <span className="mono">M-3000/XXIV</span>, any citizen may initiate
            a lawful random designation of a metropolitan municipality for the
            purpose of civic study, honorary mayorship, or leisure.
          </p>
          <ol
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 13,
              color: 'var(--ink-2)',
            }}
          >
            <li>Review the cartographic panel.</li>
            <li>Initiate the draw via the official button.</li>
            <li>Await the designation dossier.</li>
          </ol>
        </div>

        <div
          style={{
            background: 'var(--ink)',
            color: 'var(--paper-3)',
            padding: 20,
            boxShadow: '0 2px 0 var(--ink)',
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: 8,
            }}
          >
            Request · Form A-3 · 01
          </div>
          <div className="serif" style={{ fontSize: 17, marginBottom: 4 }}>
            Initiate the Public Draw
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 14 }}>
            Certified under Randomization Quorum · Session{' '}
            {new Date().getFullYear()}-IV
          </div>
          <button
            type="button"
            onClick={handleDraw}
            disabled={!pathGen || animating || disabled}
            aria-label="Throw the dart and pick a random French city"
            style={{
              width: '100%',
              background: animating ? 'var(--vermillion)' : 'var(--gold)',
              color: 'var(--paper-3)',
              border: '1px solid var(--paper-3)',
              padding: '14px 16px',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: animating || disabled ? 'progress' : 'pointer',
              transition: 'background 0.2s',
              fontFamily: 'inherit',
              opacity: !pathGen || disabled ? 0.7 : 1,
            }}
          >
            {animating && scanning ? (
              <span>
                Scanning registry <span className="dot-1">·</span>
                <span className="dot-2">·</span>
                <span className="dot-3">·</span>
              </span>
            ) : animating ? (
              <span>Designating…</span>
            ) : (
              <span>▶ Throw the Dart</span>
            )}
          </button>
          <div
            className="mono"
            style={{
              fontSize: 11,
              opacity: 0.65,
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            Action is logged for auditing purposes.
          </div>
        </div>

        <div
          style={{
            background: 'var(--paper-3)',
            border: '1px solid var(--line)',
            padding: 14,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 10,
            }}
          >
            Today's Register
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            <Stat label="Cities on file" value={cities.length.toLocaleString()} />
            <Stat label="Draws today" value={drawsTodayRef.current} />
            <Stat label="Regions covered" value={regionsCovered} />
            <Stat label="Quorum" value="✓ Met" />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default FranceMap
