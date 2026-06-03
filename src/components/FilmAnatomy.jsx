const LABELS = [
  { x: 510, y: 98,  title: 'Magnitude',   sub: 'How brightly it is loved',      lx1: 260, ly1: 234, lx2: 260, ly2: 98 },
  { x: 510, y: 210, title: 'Spectrum',     sub: 'The feeling it leaves behind',   lx1: 340, ly1: 272, lx2: 400, ly2: 210 },
  { x: 510, y: 350, title: 'Coordinates',  sub: 'Its place in the sky of moods',  lx1: 340, ly1: 292, lx2: 400, ly2: 350 },
  { x: 510, y: 450, title: 'Age',          sub: 'When it first burned',           lx1: 260, ly1: 330, lx2: 260, ly2: 450 },
]

export default function FilmAnatomy() {
  return (
    <section className="anatomy-section obs">
      <div className="shell">
        <div className="obs section-head">
          <div className="eyebrow">i · Why a film is a star</div>
          <h2>Every film burns with its own light.</h2>
          <p>
            A film isn't a row in a database here. It's a star — and like a
            star, it has properties you can read at a glance.
          </p>
        </div>

        <svg
          className="anatomy-stage"
          viewBox="0 0 1040 560"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff4dd" stopOpacity="1" />
              <stop offset="38%"  stopColor="#c9a14a" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c9a14a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#c9a14a" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#c9a14a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient glow */}
          <circle cx="260" cy="280" r="110" fill="url(#starGlow)" />

          {/* Pulsing rings */}
          <circle cx="260" cy="280" r="38"  fill="none" stroke="#c9a14a" strokeWidth="0.9"
            style={{ animation: 'ringPulse 3.2s ease-in-out infinite' }} />
          <circle cx="260" cy="280" r="72"  fill="none" stroke="#c9a14a" strokeWidth="0.6"
            style={{ animation: 'ringPulse 3.2s ease-in-out 0.8s infinite' }} />
          <circle cx="260" cy="280" r="116" fill="none" stroke="#c9a14a" strokeWidth="0.4"
            style={{ animation: 'ringPulse 3.2s ease-in-out 1.6s infinite' }} />

          {/* Star core */}
          <circle cx="260" cy="280" r="24" fill="url(#starCore)" />
          <circle cx="260" cy="280" r="7"  fill="#fff4dd" />

          {/* Connector lines */}
          <polyline points="260,242 260,98 510,98"   fill="none" stroke="#c9a14a" strokeWidth="0.7" opacity="0.35" />
          <polyline points="336,272 400,210 510,210" fill="none" stroke="#c9a14a" strokeWidth="0.7" opacity="0.35" />
          <polyline points="336,290 400,350 510,350" fill="none" stroke="#c9a14a" strokeWidth="0.7" opacity="0.35" />
          <polyline points="260,318 260,450 510,450" fill="none" stroke="#c9a14a" strokeWidth="0.7" opacity="0.35" />

          {/* Label anchor dots */}
          {LABELS.map((l) => (
            <circle key={l.title} cx={l.x} cy={l.y} r="3" fill="#c9a14a" opacity="0.7" />
          ))}

          {/* Labels */}
          {LABELS.map((l) => (
            <g key={l.title}>
              <text x={l.x + 14} y={l.y + 4}
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize="18" fontWeight="400" fill="#f4efe6">
                {l.title}
              </text>
              <text x={l.x + 14} y={l.y + 20}
                fontFamily="'Hanken Grotesk', system-ui, sans-serif"
                fontSize="12" fill="rgba(244,239,230,0.42)" letterSpacing="0.04em">
                {l.sub}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
