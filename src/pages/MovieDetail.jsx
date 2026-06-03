import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const MOVIE = {
  title: 'A Film Yet to Be Named',
  year: '2001',
  director: 'A. Director',
  feeling: 'deeply still',
  accent: '#7eb8d4',
  description: 'This film arrives quietly and asks nothing except your full attention. It moves at the pace of thought — unhurried, precise, alive to the texture of ordinary moments that turn out to be extraordinary.',
  why: "Some films explain themselves. This one doesn't need to. It trusts you to sit inside it, to let its logic work on you slowly, the way light does when it enters a room at a certain angle and changes everything.",
  constellation: { name: 'The Quiet Hours', slug: 'quiet-hours' },
}

const NEARBY = [
  { title: 'Another Quiet Film', year: '1998', director: 'B. Director', feeling: 'contemplative', slug: 'quiet-hours', index: 1 },
  { title: 'The Still Hours',    year: '2010', director: 'C. Director', feeling: 'melancholic',   slug: 'quiet-hours', index: 2 },
  { title: 'What Remains',       year: '2005', director: 'D. Director', feeling: 'tender',        slug: 'quiet-hours', index: 3 },
]

const GLYPH_DOTS  = [[28,148],[68,88],[120,54],[176,84],[216,44],[236,118]]
const GLYPH_LINES = [[0,1],[1,2],[2,3],[3,4],[4,5]]

function accentAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

function NearbyCard({ star }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={`/movie/${star.slug}-${star.index}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'var(--bg-2)' : 'var(--bg-1)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          transition: 'background 0.3s, transform 0.3s var(--ease)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: MOVIE.accent,
            boxShadow: `0 0 6px 1px ${accentAlpha(MOVIE.accent, 0.5)}`,
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
          border: `1px solid ${accentAlpha(MOVIE.accent, 0.4)}`,
          borderRadius: 999, fontSize: 11, color: MOVIE.accent,
          letterSpacing: '0.1em', fontFamily: 'var(--sans)',
        }}>
          {star.feeling}
        </div>
      </div>
    </Link>
  )
}

export default function MovieDetail() {
  useEffect(() => {
    const els = document.querySelectorAll('.obs')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.12 },
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const { title, year, director, feeling, accent, description, why, constellation } = MOVIE

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={() => {}} />

      {/* ── Movie Hero ── */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '160px 0 80px',
        position: 'relative',
      }}>
        {/* Accent radial glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 30% 60%, ${accentAlpha(accent, 0.08)}, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div className="shell">
          <Link
            to={`/collections/${constellation.slug}`}
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
            ← {constellation.name}
          </Link>

          <div style={{
            display: 'inline-block', marginBottom: 20,
            padding: '5px 14px',
            border: `1px solid ${accent}60`,
            borderRadius: 999, fontSize: 11, color: accent,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontFamily: 'var(--sans)',
          }}>
            {feeling}
          </div>

          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 300,
            fontSize: 'clamp(42px,7vw,100px)',
            lineHeight: 0.94, letterSpacing: '-0.02em',
            color: 'var(--ink)',
            display: 'block',
          }}>
            {title}
          </h1>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 24,
            marginTop: 20,
            fontFamily: 'var(--sans)', fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: 'var(--ink-mute)',
          }}>
            <span>{year}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)', flexShrink: 0 }} />
            <span>{director}</span>
          </div>

          <p style={{
            fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
            fontSize: 17, lineHeight: 1.8, maxWidth: '52ch', marginTop: 28,
          }}>
            {description}
          </p>
        </div>
      </section>

      <div className="shell"><div className="gold-rule" /></div>

      {/* ── Why This Star Matters ── */}
      <section style={{ padding: '100px 0' }}>
        <div className="shell">
          <div className="obs">
            <div className="eyebrow eyebrow--mute">Why this star</div>
            <h2 style={{
              fontFamily: 'var(--display)', fontWeight: 300,
              fontSize: 'clamp(28px,4vw,52px)',
              marginTop: 12, maxWidth: '14ch', lineHeight: 1.1,
              color: 'var(--ink)',
            }}>
              Some films choose you.
            </h2>
            <p style={{
              fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
              fontSize: 18, lineHeight: 1.85, maxWidth: '54ch', marginTop: 24,
            }}>
              {why}
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Constellation ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="shell">
          <div className="gold-rule" />
          <div className="obs" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
            marginTop: 60,
          }}>
            {/* Left — constellation info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="eyebrow eyebrow--mute">Part of</div>
              <div style={{
                fontFamily: 'var(--display)', fontWeight: 300,
                fontSize: 36, color: 'var(--ink)', lineHeight: 1.1,
              }}>
                {constellation.name}
              </div>
              <p style={{
                fontFamily: 'var(--display)', fontStyle: 'italic',
                color: 'var(--gold)', fontSize: 18,
              }}>
                {feeling}
              </p>
              <Link
                to={`/collections/${constellation.slug}`}
                className="btn btn-ghost"
                style={{ marginTop: 24, display: 'inline-block' }}
              >
                Travel this constellation →
              </Link>
            </div>

            {/* Right — SVG glyph */}
            <div>
              <svg viewBox="0 0 240 180" style={{ width: '100%', maxWidth: 240, display: 'block' }}>
                {GLYPH_LINES.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={GLYPH_DOTS[a][0]} y1={GLYPH_DOTS[a][1]}
                    x2={GLYPH_DOTS[b][0]} y2={GLYPH_DOTS[b][1]}
                    stroke={accent} strokeWidth="1" opacity="0.45"
                  />
                ))}
                {GLYPH_DOTS.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3.5" fill="#f4e6c4" opacity="0.9" />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nearby Stars ── */}
      <section style={{ padding: '80px 0 120px' }}>
        <div className="shell">
          <div className="obs">
            <h3 style={{
              fontFamily: 'var(--display)', fontWeight: 300,
              fontSize: 'clamp(24px,3vw,40px)', color: 'var(--ink)',
            }}>
              Nearby stars
            </h3>
            <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-mute)', fontSize: 14, marginTop: 8 }}>
              Other films from the same constellation.
            </p>
            <div className="gold-rule" style={{ margin: '28px 0' }} />
          </div>

          <div className="obs" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {NEARBY.map(star => <NearbyCard key={star.title} star={star} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
