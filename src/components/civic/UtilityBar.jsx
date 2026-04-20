function UtilityBar() {
  return (
    <div
      style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        fontSize: 12,
        borderBottom: '1px solid var(--gold)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '6px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.85 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#7ac28a',
                display: 'inline-block',
              }}
            />
            An official portal of the Federation of Solona-3000
          </span>
        </div>
        <div style={{ display: 'flex', gap: 18, opacity: 0.85 }}>
          <a href="#" style={{ color: 'var(--paper)' }}>EN</a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a href="#" style={{ color: 'var(--paper)', opacity: 0.6 }}>FR</a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a href="#" style={{ color: 'var(--paper)', opacity: 0.6 }}>ES</a>
          <span style={{ opacity: 0.3 }}>|</span>
          <a href="#" style={{ color: 'var(--paper)' }}>Accessibility</a>
          <a href="#" style={{ color: 'var(--paper)' }}>Contact</a>
        </div>
      </div>
    </div>
  )
}

export default UtilityBar
