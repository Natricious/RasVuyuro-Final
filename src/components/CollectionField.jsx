import { Link } from 'react-router-dom'
import CONSTELLATIONS from '../data/constellations'

const POSITIONS = [
  { left: '1%',  top: '2%'  },
  { left: '55%', top: '6%'  },
  { left: '26%', top: '38%' },
  { left: '72%', top: '44%' },
  { left: '2%',  top: '68%' },
  { left: '49%', top: '74%' },
]

const GLYPHS = [
  // The Quiet Hours — gentle arc
  { dots: [[18,88],[44,58],[80,40],[116,52],[142,80],[156,104]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  // The Long Night — vertical zigzag
  { dots: [[28,14],[94,32],[42,62],[104,82],[34,108],[92,108]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  // The Burning World — angular burst
  { dots: [[80,10],[146,52],[124,110],[44,108],[18,46],[80,60]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[5,2]] },
  // The Open Road — horizontal trail
  { dots: [[8,64],[46,46],[82,60],[118,40],[148,60],[130,94]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  // The Mirror — symmetric diamond
  { dots: [[80,12],[36,46],[124,46],[20,90],[140,90],[80,74]], lines: [[0,1],[0,2],[1,3],[2,4],[1,5],[2,5]] },
  // The Strange — irregular scatter
  { dots: [[14,24],[62,12],[106,46],[68,82],[28,92],[126,88],[142,32]], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[1,6],[2,6]] },
]

function ConstellationGlyph({ glyph, accent }) {
  const { dots, lines } = glyph
  return (
    <svg viewBox="0 0 160 120" width="160" height="120" style={{ display: 'block' }}>
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={dots[a][0]} y1={dots[a][1]}
          x2={dots[b][0]} y2={dots[b][1]}
          stroke={accent} strokeWidth="0.7" opacity="0.4"
        />
      ))}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={accent} opacity="0.85" />
      ))}
    </svg>
  )
}

export default function CollectionField() {
  return (
    <section id="collections" className="coll-section">
      <div className="shell">
        <div className="obs section-head">
          <div className="eyebrow">ii · The Constellations</div>
          <h2>Six feelings. Six skies.</h2>
          <p>
            Each constellation is a mood — a gravitational pull that draws certain
            films together. Navigate to one and the sky will align itself around
            its stars.
          </p>
        </div>

        <div className="coll-field">
          {CONSTELLATIONS.map((c, i) => (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="coll-node" style={POSITIONS[i]}>
                <ConstellationGlyph glyph={GLYPHS[i]} accent={c.accent} />
                <div className="coll-name">{c.name}</div>
                <div className="coll-feeling">{c.feeling}</div>
                <div className="coll-count">{c.stars.length} stars · travel in →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
