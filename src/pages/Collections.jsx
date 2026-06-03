import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import CONSTELLATIONS from '../data/constellations'

const GLYPHS = [
  { dots: [[18,88],[44,58],[80,40],[116,52],[142,80],[156,104]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  { dots: [[28,14],[94,32],[42,62],[104,82],[34,108],[92,108]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  { dots: [[80,10],[146,52],[124,110],[44,108],[18,46],[80,60]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[5,2]] },
  { dots: [[8,64],[46,46],[82,60],[118,40],[148,60],[130,94]],  lines: [[0,1],[1,2],[2,3],[3,4],[4,5]] },
  { dots: [[80,12],[36,46],[124,46],[20,90],[140,90],[80,74]],  lines: [[0,1],[0,2],[1,3],[2,4],[1,5],[2,5]] },
  { dots: [[14,24],[62,12],[106,46],[68,82],[28,92],[126,88],[142,32]], lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[1,6],[2,6]] },
]

function ConstellationGlyph({ glyph, accent }) {
  const { dots, lines } = glyph
  return (
    <svg viewBox="0 0 160 120" width="120" height="90" style={{ display: 'block' }}>
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={dots[a][0]} y1={dots[a][1]}
          x2={dots[b][0]} y2={dots[b][1]}
          stroke={accent} strokeWidth="0.8" opacity="0.45"
        />
      ))}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#f4e6c4" opacity="0.9" />
      ))}
    </svg>
  )
}

function ConstellationCard({ con, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={`/collections/${con.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'var(--bg-2)' : 'var(--bg-1)',
          padding: '36px 32px',
          minHeight: 220,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'background 0.3s var(--ease), transform 0.3s var(--ease)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          cursor: 'pointer',
        }}
      >
        <ConstellationGlyph glyph={GLYPHS[index]} accent={con.accent} />

        <div style={{
          fontFamily: 'var(--display)', fontWeight: 300,
          fontSize: 28, lineHeight: 1.1, color: 'var(--ink)',
        }}>
          {con.name}
        </div>

        <div style={{
          fontFamily: 'var(--display)', fontStyle: 'italic',
          fontSize: 16, color: con.accent,
        }}>
          {con.feeling}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11,
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: 'var(--ink-faint)',
          }}>
            {con.stars.length} stars
          </span>
          <span style={{
            color: hovered ? 'var(--gold)' : 'var(--ink-faint)',
            transition: 'color 0.3s var(--ease)',
            fontSize: 16,
          }}>
            →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Collections({ openWizard }) {
  useEffect(() => {
    const els = document.querySelectorAll('.obs')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.12 },
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={openWizard} />

      {/* ── Hero ── */}
      <section style={{ padding: '160px 0 80px' }}>
        <div className="shell">
          <div className="eyebrow">The Sky</div>
          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 300,
            fontSize: 'clamp(48px,8vw,110px)',
            lineHeight: 0.92, letterSpacing: '-0.02em',
            color: 'var(--ink)', marginTop: 12,
          }}>
            Six Constellations.
          </h1>
          <p style={{
            fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
            fontSize: 18, maxWidth: '48ch', marginTop: 20, lineHeight: 1.7,
          }}>
            Every feeling has its own sky. Choose the one that matches your evening.
          </p>
        </div>
      </section>

      <div className="shell"><div className="gold-rule" /></div>

      {/* ── Constellation Grid ── */}
      <section style={{ padding: '80px 0 120px' }}>
        <div className="shell">
          <div className="obs" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 1,
            background: 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {CONSTELLATIONS.map((con, i) => (
              <ConstellationCard key={con.slug} con={con} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
