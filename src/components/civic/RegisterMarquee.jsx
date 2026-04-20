const ITEMS = [
  'Draw No. 48,221 concluded — Annecy selected',
  'Public hearing on croissant allocation · April 24',
  'New municipal badge design open for comment',
  'Quarterly population census published',
  'Bulletin IV-26 available for download',
]

function RegisterMarquee() {
  return (
    <div
      style={{
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        background: 'var(--paper-3)',
        display: 'flex',
        alignItems: 'stretch',
        fontSize: 12,
      }}
    >
      <div
        style={{
          background: 'var(--ink)',
          color: 'var(--paper-3)',
          padding: '6px 14px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontSize: 10,
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        Latest from the Register
      </div>
      <div style={{ overflow: 'hidden', flex: 1, position: 'relative' }}>
        <div
          className="mono"
          style={{
            display: 'flex',
            gap: 48,
            padding: '6px 24px',
            whiteSpace: 'nowrap',
            animation: 'marquee 60s linear infinite',
          }}
        >
          {[...ITEMS, ...ITEMS].map((x, i) => (
            <span key={i} style={{ color: 'var(--muted)' }}>
              <span style={{ color: 'var(--gold)', marginRight: 8 }}>§</span>
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RegisterMarquee
