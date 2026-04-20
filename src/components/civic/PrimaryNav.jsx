const ITEMS = [
  { label: 'Home', href: '#', active: true },
  { label: 'Municipalities', href: '#' },
  { label: 'Records & Registries', href: '#' },
  { label: 'Public Ballots', href: '#' },
  { label: 'Bulletins', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'About the Ministry', href: '#' },
]

function PrimaryNav() {
  return (
    <nav
      style={{
        background: 'var(--sovereign-dark)',
        color: 'var(--paper-3)',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        {ITEMS.map((it, i) => (
          <a
            key={i}
            href={it.href}
            style={{
              padding: '12px 18px',
              color: 'var(--paper-3)',
              textDecoration: 'none',
              borderBottom: it.active
                ? '3px solid var(--gold)'
                : '3px solid transparent',
              background: it.active ? 'rgba(255,255,255,0.06)' : 'transparent',
              letterSpacing: '0.01em',
            }}
          >
            {it.label}
          </a>
        ))}
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 12px',
          }}
        >
          <input
            placeholder="Search the register…"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--paper-3)',
              padding: '6px 10px',
              fontSize: 12,
              width: 200,
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>
    </nav>
  )
}

export default PrimaryNav
