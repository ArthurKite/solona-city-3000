function Seal({ size = 72 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Seal of Solona 3000"
      style={{ display: 'block' }}
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <defs>
        <path id="sealArcTop" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" />
        <path id="sealArcBot" d="M 14 52 A 36 36 0 0 0 86 52" fill="none" />
      </defs>
      <text fontFamily="Libre Caslon Text" fontSize="6.2" letterSpacing="1.5" fill="currentColor">
        <textPath href="#sealArcTop" startOffset="50%" textAnchor="middle">
          RÉPUBLIQUE · NUMÉRIQUE
        </textPath>
      </text>
      <text fontFamily="Libre Caslon Text" fontSize="5" letterSpacing="2" fill="currentColor">
        <textPath href="#sealArcBot" startOffset="50%" textAnchor="middle">
          · MMXXVI · SOLONA · III M ·
        </textPath>
      </text>
      <g transform="translate(50 50)" fill="currentColor">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = ((i * 30) * Math.PI) / 180
          const x1 = Math.cos(a) * 2
          const y1 = Math.sin(a) * 2
          const x2 = Math.cos(a) * 22
          const y2 = Math.sin(a) * 22
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={i % 3 === 0 ? 1.2 : 0.5}
            />
          )
        })}
        <circle r="4" fill="currentColor" />
        <circle r="2" fill="var(--paper-3)" />
      </g>
      {[0, 90, 180, 270].map((deg) => (
        <circle
          key={deg}
          cx={50 + 38 * Math.cos((deg * Math.PI) / 180)}
          cy={50 + 38 * Math.sin((deg * Math.PI) / 180)}
          r="1.4"
          fill="currentColor"
        />
      ))}
    </svg>
  )
}

export default Seal
