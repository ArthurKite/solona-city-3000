import Seal from './Seal'

const ISSUE_DATE = new Date().toISOString().slice(0, 10).replace(/-/g, ' · ')
const SESSION = String(Math.floor(10000 + Math.random() * 89999))

function Masthead() {
  return (
    <header
      style={{
        background: 'var(--sovereign)',
        color: 'var(--paper-3)',
        borderBottom: '4px double var(--gold)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ color: 'var(--gold)' }}>
          <Seal size={78} />
        </div>
        <div
          style={{
            flex: 1,
            borderLeft: '1px solid rgba(245,241,232,0.25)',
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.25em',
              opacity: 0.75,
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            République Numérique de Solona 3000 · Federal Register
          </div>
          <h1
            className="serif"
            style={{
              margin: '3px 0 2px',
              fontSize: 30,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            Ministère des Villes Aléatoires
          </h1>
          <div
            style={{ fontSize: 13, opacity: 0.85, fontStyle: 'italic' }}
            className="serif"
          >
            Ministry for the Algorithmic Designation of Municipalities
          </div>
        </div>
        <div
          style={{ textAlign: 'right', fontSize: 11, opacity: 0.8 }}
          className="mono"
        >
          <div>DOC-REF · SOL-3000/REG-IV</div>
          <div>ISSUE · {ISSUE_DATE}</div>
          <div>SESSION · {SESSION}</div>
        </div>
      </div>
    </header>
  )
}

export default Masthead
