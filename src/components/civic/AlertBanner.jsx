import cities from '../../data/frenchCities.json'

function AlertBanner() {
  return (
    <div
      style={{
        background: 'var(--paper-2)',
        borderBottom: '1px solid var(--line)',
        fontSize: 13,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            background: 'var(--vermillion)',
            color: 'var(--paper-3)',
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Public Notice
        </span>
        <span>
          <strong>Randomization Quorum met.</strong> The Ministry has certified{' '}
          {cities.length.toLocaleString()} eligible municipalities for today's
          public draw.
        </span>
        <span style={{ flex: 1 }} />
        <a href="#" style={{ fontSize: 12 }}>Read bulletin ›</a>
      </div>
    </div>
  )
}

export default AlertBanner
