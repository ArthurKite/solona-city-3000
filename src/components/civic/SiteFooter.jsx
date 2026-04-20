import Seal from './Seal'

const COLS = [
  {
    h: 'Registries',
    items: [
      'Municipal ledger',
      'Population census',
      'Meteorological archive',
      'Public draws',
    ],
  },
  {
    h: 'Services',
    items: [
      'Honorary mayorship',
      'Badge issuance',
      'Campaign templates',
      'Digital dossier',
    ],
  },
  {
    h: 'About',
    items: ['The Ministry', 'Staff directory', 'Annual report', 'Press office'],
  },
  {
    h: 'Contact',
    items: ['Mail address', 'Accessibility', 'FOIA requests', 'Ombudsman'],
  },
]

const BUILD = String(Math.floor(Math.random() * 9000) + 1000)

function SiteFooter() {
  return (
    <footer
      style={{
        marginTop: 60,
        background: 'var(--ink)',
        color: 'var(--paper-3)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '40px 24px 24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr repeat(4, 1fr)',
            gap: 36,
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ color: 'var(--gold)', marginBottom: 10 }}>
              <Seal size={58} />
            </div>
            <div
              className="serif"
              style={{ fontSize: 17, lineHeight: 1.25, fontWeight: 700 }}
            >
              République Numérique
              <br />
              de Solona 3000
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              An official portal of the Federation.
            </div>
          </div>
          {COLS.map((c, i) => (
            <div key={i}>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: 12,
                }}
              >
                {c.h}
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {c.items.map((x, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      style={{
                        color: 'var(--paper-3)',
                        opacity: 0.85,
                        textDecoration: 'none',
                        fontSize: 13,
                      }}
                    >
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mono"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.18)',
            marginTop: 32,
            paddingTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            opacity: 0.7,
          }}
        >
          <span>© MMXXVI · MINISTRY SEAL · ALL DESIGNATIONS CEREMONIAL</span>
          <span>POWERED BY CLAUDE &amp; OPEN-METEO · BUILD {BUILD}</span>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
