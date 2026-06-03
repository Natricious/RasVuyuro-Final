const PARAS = [
  'RasVuyuro was built against the catalogue. Against the endless scroll, the algorithm that mirrors your past, the recommendation that wants you to stay, not to feel.',
  'Here, you begin with a feeling. The sky builds around it. One film emerges — not because it is popular, but because it is right for this particular evening, this particular version of you.',
  'Watch it. Come back. The sky will have moved.',
]

export default function Philosophy() {
  return (
    <section className="philosophy">
      <div className="shell">
        <div className="gold-rule" />
        <h2 className="obs">
          "A film chosen well is an evening lived twice."
        </h2>
        {PARAS.map((text, i) => (
          <p
            key={i}
            className="obs"
            style={{ transitionDelay: `${i * 0.15}s` }}
          >
            {text}
          </p>
        ))}
        <div className="gold-rule" style={{ marginTop: 56 }} />
      </div>
    </section>
  )
}
