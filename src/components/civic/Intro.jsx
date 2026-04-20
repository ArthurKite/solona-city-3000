function Intro() {
  const today = new Date()
  return (
    <section
      style={{
        padding: '40px 0 26px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 40,
        alignItems: 'end',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 18,
          }}
        >
          <span className="rule-thick-thin" style={{ width: 60 }} />
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: 'var(--muted)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Public Service · Volume IV · Directive 26-A
          </span>
        </div>
        <h2
          className="serif"
          style={{
            margin: 0,
            fontSize: 58,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--ink)',
            maxWidth: 900,
          }}
        >
          Solona City{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--sovereign)' }}>
            3000
          </span>
        </h2>
        <p
          className="serif"
          style={{
            margin: '14px 0 0',
            fontSize: 20,
            color: 'var(--ink-2)',
            fontStyle: 'italic',
            maxWidth: 680,
            lineHeight: 1.4,
          }}
        >
          The official civic instrument for the random designation of French
          municipalities — chartered, sealed, and delivered by the Ministry.
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: 'var(--muted)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Today's Session
        </div>
        <div
          className="serif"
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          {today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: 'var(--sovereign)',
            marginTop: 4,
            letterSpacing: '0.15em',
          }}
        >
          {today.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          · CET
        </div>
      </div>
    </section>
  )
}

export default Intro
