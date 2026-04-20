function InfoCard({ tag, title, body }) {
  return (
    <article
      style={{
        background: 'var(--paper-3)',
        borderTop: '3px solid var(--ink)',
        padding: '16px 18px',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: 'var(--gold)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {tag}
      </div>
      <h4
        className="serif"
        style={{
          margin: '0 0 8px',
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: 'var(--ink-2)',
          lineHeight: 1.55,
        }}
      >
        {body}
      </p>
    </article>
  )
}

function InfoRail() {
  return (
    <div
      style={{
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}
    >
      <InfoCard
        tag="I — About"
        title="What is this Ministry?"
        body="A fictional civic body responsible for the equitable, algorithmic designation of French municipalities to worthy citizens seeking leisure, honorary mayorship, or a weekend destination."
      />
      <InfoCard
        tag="II — Method"
        title="How the draw works"
        body="Each call to the Registry selects one eligible municipality uniformly at random from the Ministry's approved ledger of metropolitan cities. Meteorological data is drawn from public observation stations."
      />
      <InfoCard
        tag="III — Legal"
        title="Terms of designation"
        body="All designations are ceremonial. The Ministry holds no dominion over actual municipal affairs. Citizen campaign communiqués are provided for entertainment purposes only."
      />
    </div>
  )
}

export default InfoRail
