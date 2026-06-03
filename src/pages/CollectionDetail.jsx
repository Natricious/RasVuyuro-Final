import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import CONSTELLATIONS from '../data/constellations'

const GLYPH_DOTS  = [[48,188],[96,108],[160,68],[224,104],[280,52],[312,152]]
const GLYPH_LINES = [[0,1],[1,2],[2,3],[3,4],[4,5]]

function accentAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

function StarCard({ star, accent }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-2)' : 'var(--bg-1)',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'background 0.3s',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 4, height: 4, borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 6px 1px ${accentAlpha(accent, 0.5)}`,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 12,
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'var(--ink-mute)',
        }}>
          {star.year}
        </span>
      </div>

      <div style={{
        fontFamily: 'var(--display)', fontWeight: 300,
        fontSize: 22, lineHeight: 1.2, color: 'var(--ink)',
      }}>
        {star.title}
      </div>

      <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-mute)' }}>
        {star.director}
      </div>

      <div style={{
        display: 'inline-block', alignSelf: 'flex-start', marginTop: 8,
        padding: '4px 12px',
        border: `1px solid ${accentAlpha(accent, 0.4)}`,
        borderRadius: 999, fontSize: 11, color: accent,
        letterSpacing: '0.1em', fontFamily: 'var(--sans)',
      }}>
        {star.feeling}
      </div>
    </div>
  )
}

export default function CollectionDetail() {
  const { slug } = useParams()
  const constellation = CONSTELLATIONS.find(c => c.slug === slug)

  useEffect(() => {
    const els = document.querySelectorAll('.obs')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.12 },
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [slug])

  if (!constellation) {
    return (
      <div style={{
        position: 'relative', minHeight: '100vh', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', gap: 16,
      }}>
        <Nav onBeginAlignment={() => {}} />
        <div className="eyebrow">404</div>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)' }}>
          This constellation does not exist.
        </h2>
        <Link to="/" style={{ color: 'var(--gold)', fontFamily: 'var(--sans)', fontSize: 13, marginTop: 8 }}>
          ← Return to the sky
        </Link>
      </div>
    )
  }

  const { name, feeling, accent, description, atmosphericText, stars } = constellation

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={() => {}} />

      {/* ── Collection Hero ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '140px 0 80px',
      }}>
        <div className="shell">
          <Link
            to="/"
            style={{
              display: 'inline-block', marginBottom: 48,
              fontFamily: 'var(--sans)', fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              color: 'var(--ink-mute)', textDecoration: 'none',
              transition: 'color 0.3s var(--ease)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-mute)'}
          >
            ← Back to the sky
          </Link>

          <div className="eyebrow">Constellation</div>

          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 300,
            fontSize: 'clamp(48px,8vw,120px)',
            lineHeight: 0.92, letterSpacing: '-0.02em',
            color: 'var(--ink)', marginTop: 12,
          }}>
            {name}
          </h1>

          <p style={{
            fontFamily: 'var(--display)', fontStyle: 'italic',
            color: accent, fontSize: 'clamp(18px,2.5vw,28px)', marginTop: 16,
          }}>
            {feeling}
          </p>

          <p style={{
            fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
            fontSize: 17, lineHeight: 1.75, maxWidth: '52ch', marginTop: 24,
          }}>
            {description}
          </p>
        </div>
      </section>

      <div className="shell"><div className="gold-rule" /></div>

      {/* ── Constellation Overview ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="shell">
          <div className="obs" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}>
            <div>
              <svg viewBox="0 0 320 240" style={{ width: '100%', maxWidth: 320, display: 'block' }}>
                {GLYPH_LINES.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={GLYPH_DOTS[a][0]} y1={GLYPH_DOTS[a][1]}
                    x2={GLYPH_DOTS[b][0]} y2={GLYPH_DOTS[b][1]}
                    stroke={accent} strokeWidth="1" opacity="0.45"
                  />
                ))}
                {GLYPH_DOTS.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#f4e6c4" opacity="0.9" />
                ))}
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="eyebrow eyebrow--mute">Overview</div>
              <div style={{
                fontFamily: 'var(--display)', fontSize: 48,
                fontWeight: 300, color: accent, lineHeight: 1,
              }}>
                {stars.length} stars in this constellation
              </div>
              <p style={{
                fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
                fontSize: 16, lineHeight: 1.8, fontStyle: 'italic',
              }}>
                {atmosphericText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stars Section ── */}
      <section style={{ padding: '80px 0 120px' }}>
        <div className="shell">
          <div className="obs">
            <h2 style={{
              fontFamily: 'var(--display)', fontWeight: 300,
              fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)',
            }}>
              Stars in this constellation
            </h2>
            <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-mute)', fontSize: 14, marginTop: 8 }}>
              Each one was placed here by feeling, not genre.
            </p>
            <div className="gold-rule" style={{ margin: '32px 0' }} />
          </div>

          <div className="obs" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 1,
            background: 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {stars.map(star => (
              <StarCard key={star.title} star={star} accent={accent} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
