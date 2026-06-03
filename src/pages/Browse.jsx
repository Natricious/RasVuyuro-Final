import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useMovies, useFilterOptions } from '../hooks/useMovies'

const STATUS = {
  color: 'var(--ink-mute)', fontFamily: 'var(--sans)',
  fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase',
}

const SELECT_STYLE = {
  padding: '10px 16px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--line-strong)',
  borderRadius: 999,
  color: 'var(--ink)',
  fontFamily: 'var(--sans)',
  fontSize: 12,
  letterSpacing: '0.1em',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
}

function FilterSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={SELECT_STYLE}
      onFocus={e => { e.target.style.borderColor = 'var(--gold)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--line-strong)' }}
    >
      {children}
    </select>
  )
}

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--bg-1)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s var(--ease), box-shadow 0.3s var(--ease)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 40px -12px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        {/* Poster */}
        <div style={{
          aspectRatio: '2/3', width: '100%',
          background: 'var(--bg-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12, position: 'relative',
        }}>
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--gold)',
                boxShadow: '0 0 8px 2px var(--gold-glow)',
              }} />
              <span style={{
                fontFamily: 'var(--display)', fontStyle: 'italic',
                fontSize: 16, color: 'var(--ink-mute)', textAlign: 'center',
                padding: '0 12px',
              }}>
                {movie.title}
              </span>
            </>
          )}

          {movie.imdb_rating && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(8,8,12,0.85)',
              backdropFilter: 'blur(4px)',
              border: '1px solid var(--line)',
              borderRadius: 999,
              padding: '3px 8px',
              fontSize: 11, color: 'var(--gold-bright)',
              letterSpacing: '0.08em',
              fontFamily: 'var(--sans)',
            }}>
              {movie.imdb_rating}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 18px' }}>
          <div style={{
            fontFamily: 'var(--display)', fontWeight: 300,
            fontSize: 16, lineHeight: 1.2, color: 'var(--ink)',
            marginBottom: 6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {movie.title}
          </div>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: 11,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--ink-mute)',
          }}>
            {movie.year}{movie.imdb_rating ? ` · ${movie.imdb_rating}` : ''}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Browse({ openWizard }) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [collection, setCollection] = useState('')
  const [minRating, setMinRating] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const { genres, collections: collectionOptions } = useFilterOptions()
  const { movies, loading, error } = useMovies({ search: debouncedSearch, genre, collection, minRating })

  const anyActive = genre || collection || minRating > 0 || debouncedSearch
  const clearAll = () => { setGenre(''); setCollection(''); setMinRating(0); setSearch('') }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={openWizard} />

      {/* ── Hero ── */}
      <section style={{ padding: '140px 0 60px' }}>
        <div className="shell">
          <div className="eyebrow">The Archive</div>
          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 300,
            fontSize: 'clamp(42px,6vw,88px)',
            lineHeight: 0.94, letterSpacing: '-0.02em',
            color: 'var(--ink)', marginTop: 12,
          }}>
            Every star in the sky.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)', fontSize: 17, marginTop: 16 }}>
            Search by title, or let the sky surprise you.
          </p>

          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title…"
            style={{
              display: 'block', marginTop: 32,
              width: '100%', maxWidth: 480,
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--line-strong)',
              borderRadius: 999,
              color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 15,
              outline: 'none',
              transition: 'border-color 0.3s var(--ease), box-shadow 0.3s var(--ease)',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px var(--gold-glow)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.boxShadow = 'none' }}
          />

          {/* Filter controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 24 }}>
            <FilterSelect value={genre} onChange={e => setGenre(e.target.value)}>
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </FilterSelect>

            <FilterSelect value={collection} onChange={e => setCollection(e.target.value)}>
              <option value="">All Constellations</option>
              {collectionOptions.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </FilterSelect>

            <FilterSelect value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
              <option value={0}>Any Rating</option>
              <option value={7}>7+ Stars</option>
              <option value={8}>8+ Stars</option>
              <option value={9}>9+ Stars</option>
            </FilterSelect>

            {anyActive && (
              <button
                onClick={clearAll}
                style={{
                  ...SELECT_STYLE,
                  borderColor: 'var(--gold-deep)',
                  color: 'var(--gold)',
                  background: 'transparent',
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <p style={{
            marginTop: 16, fontFamily: 'var(--sans)',
            fontSize: 12, textTransform: 'uppercase',
            letterSpacing: '0.18em', color: 'var(--ink-mute)',
          }}>
            {loading ? 'Searching the sky…' : `${movies.length} stars found`}
          </p>
        </div>
      </section>

      <div className="shell"><div className="gold-rule" /></div>

      {/* ── Movie Grid ── */}
      <section style={{ padding: '60px 0 120px' }}>
        <div className="shell">
          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center', ...STATUS }}>
              Searching the sky…
            </div>
          ) : error ? (
            <div style={{ padding: '80px 0', textAlign: 'center', ...STATUS }}>
              The sky is unreachable.
            </div>
          ) : movies.length === 0 ? (
            <div style={{
              padding: '80px 0', textAlign: 'center',
              fontFamily: 'var(--display)', fontStyle: 'italic',
              fontSize: 24, color: 'var(--ink-soft)',
            }}>
              No stars match your search.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 1,
              background: 'var(--line)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
