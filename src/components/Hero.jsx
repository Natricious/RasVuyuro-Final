export default function Hero() {
  return (
    <section className="hero">
      <div className="eyebrow">Good evening · the sky is at its darkest</div>

      <h1>
        What do you want to{' '}
        <em className="hero-feel">feel</em>
        <span className="hero-spark" />
        {' '}tonight?
      </h1>

      <p className="hero-lede">
        There is no catalogue here — only a sky. Every film is a star; every
        feeling, a constellation. Tell us how you want the night to end, and
        we'll align the whole sky on the one worth your evening.
      </p>

      <div className="hero-cta">
        <button className="btn btn-gold">Begin the Alignment</button>
        <button className="hero-ghost">or wander the sky →</button>
      </div>

      <div className="hero-stats">
        <span className="hero-stat-dot" />
        <span>Tonight's sky</span>
        <em>6 constellations</em>
        <span className="hero-sep">·</span>
        <span>36 films</span>
        <span className="hero-sep">·</span>
        <span>one for you</span>
      </div>

      <div className="hero-scroll">
        Drift lower
        <span className="hero-cue" />
      </div>
    </section>
  )
}
