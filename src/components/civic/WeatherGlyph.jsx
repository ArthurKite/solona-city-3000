function WeatherGlyph({ code, size = 28 }) {
  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
  const isSnow = [71, 73, 75].includes(code)
  const isStorm = [95, 96, 99].includes(code)
  const isFog = [45, 48].includes(code)
  const isCloud = [2, 3].includes(code)
  const clear = code === 0 || code === 1
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      style={{ display: 'block' }}
    >
      {clear && (
        <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
      {clear &&
        Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180
          return (
            <line
              key={i}
              x1={20 + Math.cos(a) * 14}
              y1={20 + Math.sin(a) * 14}
              x2={20 + Math.cos(a) * 18}
              y2={20 + Math.sin(a) * 18}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          )
        })}
      {isCloud && (
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <path d="M10 24 Q 10 18 16 18 Q 18 13 24 14 Q 30 14 30 20 Q 34 20 34 24 Z" />
        </g>
      )}
      {isFog && (
        <g stroke="currentColor" strokeWidth="1.5">
          <line x1="6" y1="14" x2="34" y2="14" />
          <line x1="6" y1="20" x2="34" y2="20" />
          <line x1="6" y1="26" x2="34" y2="26" />
        </g>
      )}
      {isRain && (
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <path d="M10 18 Q 10 12 16 12 Q 18 8 24 9 Q 30 9 30 15 Q 34 15 34 19 Z" />
          <line x1="14" y1="24" x2="12" y2="30" />
          <line x1="22" y1="24" x2="20" y2="30" />
          <line x1="30" y1="24" x2="28" y2="30" />
        </g>
      )}
      {isSnow && (
        <g stroke="currentColor" strokeWidth="1.2" fill="none">
          <path d="M10 18 Q 10 12 16 12 Q 18 8 24 9 Q 30 9 30 15 Q 34 15 34 19 Z" />
          <text x="14" y="30" fontSize="10">*</text>
          <text x="22" y="30" fontSize="10">*</text>
          <text x="30" y="30" fontSize="10">*</text>
        </g>
      )}
      {isStorm && (
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <path d="M10 18 Q 10 12 16 12 Q 18 8 24 9 Q 30 9 30 15 Q 34 15 34 19 Z" />
          <polyline points="18,22 16,28 22,28 19,34" />
        </g>
      )}
    </svg>
  )
}

export default WeatherGlyph
