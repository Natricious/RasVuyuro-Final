import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import CollectionField from '../components/CollectionField'
import FilmAnatomy from '../components/FilmAnatomy'
import MotionShowcase from '../components/MotionShowcase'
import Philosophy from '../components/Philosophy'
import Footer from '../components/Footer'

const ACCENTS = ['#7eb8d4','#9b7fd4','#d4826a','#7dd4a0','#d4c26a','#d47eb8']

export default function Home({ openWizard }) {
  const [featuredCollections, setFeaturedCollections] = useState([])
  const [collectionsLoading, setCollectionsLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    supabase
      .from('collections')
      .select('id, title_en, slug, description_en, image_url')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (!cancelled) {
          setFeaturedCollections(
            (data || []).map(c => ({ ...c, name: c.title_en, description: c.description_en }))
          )
          setCollectionsLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  const [topMovies, setTopMovies] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    supabase
      .from('movies')
      .select('id, title, year, imdb_rating, poster, tone')
      .order('imdb_rating', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (!cancelled) { setTopMovies(data || []); setMoviesLoading(false) }
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.obs')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in')
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [collectionsLoading, moviesLoading])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Nav onBeginAlignment={openWizard} />
      <Hero onBeginAlignment={openWizard} />
      <CollectionField />
      <FilmAnatomy />
      <MotionShowcase />
      <Philosophy />

      {/* ── Featured Collections ── */}
      <section style={{ padding: '100px 0', position: 'relative', zIndex: 2 }}>
        <div className="shell">
          <div className="obs">
            <p className="eyebrow">The Constellations</p>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, marginTop: 10, letterSpacing: '-0.01em' }}>
              Six skies. One for your evening.
            </h2>
          </div>
          <hr className="gold-rule" style={{ margin: '32px 0' }} />
          {collectionsLoading ? (
            <p style={{ color: 'var(--ink-mute)', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Mapping constellations…
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
              {featuredCollections.map((col, i) => (
                <Link
                  key={col.id}
                  to={`/collections/${col.slug}`}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: 'var(--bg-1)', padding: '28px 24px', transition: 'background 0.3s var(--ease), transform 0.3s var(--ease)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-1)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <p style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 22, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 8 }}>{col.name}</p>
                  <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 15, color: ACCENTS[i % ACCENTS.length] }}>
                    {col.description?.slice(0, 60)}{col.description?.length > 60 ? '…' : ''}
                  </p>
                  <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginTop: 12 }}>Travel in →</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Top Rated Stars ── */}
      <section style={{ padding: '60px 0 120px', position: 'relative', zIndex: 2 }}>
        <div className="shell">
          <div className="obs">
            <p className="eyebrow">Top Rated Stars</p>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, marginTop: 10, letterSpacing: '-0.01em' }}>
              The brightest in the sky.
            </h2>
          </div>
          <hr className="gold-rule" style={{ margin: '32px 0' }} />
          {moviesLoading ? (
            <p style={{ color: 'var(--ink-mute)', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Locating stars…
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
              {topMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit', background: 'var(--bg-1)', overflow: 'hidden', position: 'relative', transition: 'transform 0.3s var(--ease)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ aspectRatio: '2/3', width: '100%', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                    {movie.poster
                      ? <img src={movie.poster} alt={movie.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-mute)', padding: 16, textAlign: 'center' }}>{movie.title}</div>
                    }
                    {movie.imdb_rating && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(8,8,12,0.85)', backdropFilter: 'blur(4px)', border: '1px solid var(--line)', borderRadius: 999, padding: '3px 8px', fontSize: 11, color: 'var(--gold-bright)', letterSpacing: '0.08em' }}>
                        {movie.imdb_rating}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px 16px' }}>
                    <p style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 15, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.title}</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{movie.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
