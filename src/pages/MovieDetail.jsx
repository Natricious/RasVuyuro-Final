import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useMovie } from '../hooks/useMovie'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

const ACCENTS = ['#7eb8d4','#9b7fd4','#d4826a','#7dd4a0','#d4c26a','#d47eb8']

const GLYPH_DOTS  = [[28,148],[68,88],[120,54],[176,84],[216,44],[236,118]]
const GLYPH_LINES = [[0,1],[1,2],[2,3],[3,4],[4,5]]

function slugToAccent(slug) {
  if (!slug) return '#c9a14a'
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return ACCENTS[h % ACCENTS.length]
}

function slugToName(slug) {
  if (!slug) return ''
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function accentAlpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

function NearbyCard({ star, accent }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      to={`/movie/${star.id}`}
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
    </Link>
  )
}

const STATE_STYLE = {
  position: 'relative', minHeight: '100vh', zIndex: 1,
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', textAlign: 'center', gap: 16,
}

export default function MovieDetail({ openWizard }) {
  const { id } = useParams()
  const { movie, nearby, loading, error } = useMovie(id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { addToRecent } = useRecentlyViewed()

  useEffect(() => {
    if (movie) addToRecent(movie)
  }, [movie?.id])

  useEffect(() => {
    const els = document.querySelectorAll('.obs')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.12 },
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  if (loading) {
    return (
      <div style={STATE_STYLE}>
        <Nav onBeginAlignment={openWizard} />
        <p style={{
          color: 'var(--ink-mute)', fontFamily: 'var(--sans)',
          fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          Locating this star…
        </p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div style={STATE_STYLE}>
        <Nav onBeginAlignment={openWizard} />
        <div className="eyebrow">404</div>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)' }}>
          This star does not exist.
        </h2>
        <Link to="/collections" className="btn btn-ghost" style={{ marginTop: 24, display: 'inline-block' }}>
          Return to the sky
        </Link>
      </div>
    )
  }

  const firstSlug = Array.isArray(movie.collections) ? movie.collections[0] : (movie.collections || null)
  const accent = slugToAccent(firstSlug)
  const constellationName = firstSlug ? slugToName(firstSlug) : 'The Sky'
  const backTo = firstSlug ? `/collections/${firstSlug}` : '/collections'

  const title = movie.title
  const year = String(movie.year ?? '')
  const director = movie.genres
    ? (Array.isArray(movie.genres) ? movie.genres.slice(0, 2).join(', ') : movie.genres)
    : '—'
  const feeling = movie.tone
    ? (Array.isArray(movie.tone) ? movie.tone[0] : movie.tone)
    : '—'
  const description = movie.description_ka || movie.description || ''
  const why = movie.description || movie.description_ka || ''

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={openWizard} />

      {/* ── Movie Hero ── */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '160px 0 80px',
        position: 'relative',
      }}>
        {/* Poster background */}
        {movie.poster && (
          <img
            src={movie.poster}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', opacity: 0.15, zIndex: 0,
              maskImage: 'linear-gradient(to right, transparent, black 30%, black 70%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%, black 70%, transparent)',
            }}
          />
        )}

        {/* Accent radial glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `radial-gradient(ellipse 60% 50% at 30% 60%, ${accentAlpha(accent, 0.08)}, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div className="shell" style={{ position: 'relative', zIndex: 2 }}>
          <Link
            to={backTo}
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
            ← {constellationName}
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
            color: 'var(--ink)', display: 'block',
          }}>
            {title}
          </h1>

          {movie.title_ge && movie.title_ge !== movie.title && (
            <p style={{
              fontFamily: 'var(--display)',
              fontStyle: 'italic',
              fontSize: 'clamp(16px,2vw,22px)',
              color: 'var(--ink-mute)',
              marginTop: 8,
              letterSpacing: '0.01em',
            }}>{movie.title_ge}</p>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: 24,
            marginTop: 20,
            fontFamily: 'var(--sans)', fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: 'var(--ink-mute)',
          }}>
            <span>{year}</span>
            {movie.imdb_rating && (
              <>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)', flexShrink: 0 }} />
                <span>★ {movie.imdb_rating}</span>
              </>
            )}
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)', flexShrink: 0 }} />
            <span>{director}</span>
          </div>

          <p style={{
            fontFamily: 'var(--sans)', color: 'var(--ink-soft)',
            fontSize: 17, lineHeight: 1.8, maxWidth: '52ch', marginTop: 28,
          }}>
            {description}
          </p>

          {(() => {
            const themesArr = Array.isArray(movie.themes) ? movie.themes : (movie.themes ? [movie.themes] : [])
            return themesArr.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                {themesArr.map(theme => (
                  <span key={theme} style={{
                    padding: '4px 12px',
                    border: '1px solid var(--line-strong)',
                    borderRadius: 999,
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    fontFamily: 'var(--sans)',
                  }}>{theme}</span>
                ))}
              </div>
            ) : null
          })()}

          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <button
              onClick={() => toggleFavorite(movie)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                background: isFavorite(movie.id) ? 'var(--gold-glow)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isFavorite(movie.id) ? 'var(--gold)' : 'var(--line-strong)'}`,
                borderRadius: 999, color: isFavorite(movie.id) ? 'var(--gold)' : 'var(--ink-soft)',
                fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.3s var(--ease)',
              }}
            >
              {isFavorite(movie.id) ? '♡ Favorited' : '♡ Add to Favorites'}
            </button>

            <button
              onClick={() => toggleWatchlist(movie)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                background: isInWatchlist(movie.id) ? 'var(--gold-glow)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isInWatchlist(movie.id) ? 'var(--gold-deep)' : 'var(--line-strong)'}`,
                borderRadius: 999, color: isInWatchlist(movie.id) ? 'var(--gold-bright)' : 'var(--ink-soft)',
                fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.3s var(--ease)',
              }}
            >
              {isInWatchlist(movie.id) ? '✦ In Watchlist' : '✦ Add to Watchlist'}
            </button>

            {movie.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: 999,
                  color: 'var(--ink-soft)',
                  fontFamily: 'var(--sans)',
                  fontSize: 12,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 0.3s var(--ease)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--ink-soft)' }}
              >
                View on IMDb →
              </a>
            )}
          </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="eyebrow eyebrow--mute">Part of</div>
              <div style={{
                fontFamily: 'var(--display)', fontWeight: 300,
                fontSize: 36, color: 'var(--ink)', lineHeight: 1.1,
              }}>
                {constellationName}
              </div>
              <p style={{
                fontFamily: 'var(--display)', fontStyle: 'italic',
                color: 'var(--gold)', fontSize: 18,
              }}>
                {feeling}
              </p>
              <Link
                to={backTo}
                className="btn btn-ghost"
                style={{ marginTop: 24, display: 'inline-block' }}
              >
                Travel this constellation →
              </Link>
            </div>

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

      {/* ── Nearby Stars (hidden if empty) ── */}
      {nearby.length > 0 && (
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
              {nearby.map(n => (
                <NearbyCard
                  key={n.id}
                  accent={accent}
                  star={{
                    id: n.id,
                    title: n.title,
                    year: String(n.year ?? ''),
                    director: n.genres?.[0] ?? '—',
                    feeling: Array.isArray(n.tone) ? n.tone[0] : (n.tone ?? '—'),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
