import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { useWatched } from '../hooks/useWatched'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--bg-1)', overflow: 'hidden', position: 'relative',
          transition: 'transform 0.3s var(--ease)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div style={{ aspectRatio: '2/3', width: '100%', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {movie.poster
            ? <img src={movie.poster} alt={movie.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-mute)', padding: 16, textAlign: 'center' }}>{movie.title}</span>
          }
          {movie.imdb_rating && (
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(8,8,12,0.85)', backdropFilter: 'blur(4px)', border: '1px solid var(--line)', borderRadius: 999, padding: '3px 8px', fontSize: 11, color: 'var(--gold-bright)', letterSpacing: '0.08em', fontFamily: 'var(--sans)' }}>
              {movie.imdb_rating}
            </div>
          )}
        </div>
        <div style={{ padding: '12px 14px 16px' }}>
          <p style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 15, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.title}</p>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontFamily: 'var(--sans)' }}>{movie.year}</p>
        </div>
      </div>
    </Link>
  )
}

function MovieGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 1, background: 'var(--line)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
      {items.map(m => <MovieCard key={m.id} movie={m} />)}
    </div>
  )
}

function ProfileSection({ title, subtitle, emptyMsg, items }) {
  return (
    <section style={{ padding: '60px 0' }}>
      <div className="shell">
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(24px,3vw,40px)', color: 'var(--ink)' }}>{title}</h2>
        <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-mute)', fontSize: 14, marginTop: 8 }}>{subtitle}</p>
        <div className="gold-rule" style={{ margin: '24px 0' }} />
        {items.length === 0
          ? <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-mute)', textAlign: 'center', padding: '40px 0' }}>{emptyMsg}</p>
          : <MovieGrid items={items} />
        }
      </div>
    </section>
  )
}

export default function Profile({ openWizard }) {
  const { user } = useAuth()
  const { favoriteIds } = useFavorites()
  const { watchlistIds } = useWatchlist()
  const { recentIds } = useRecentlyViewed()
  const { watchedIds } = useWatched()

  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [watchlistMovies, setWatchlistMovies] = useState([])
  const [recentMovies, setRecentMovies] = useState([])
  const [watchedMovies, setWatchedMovies] = useState([])

  useEffect(() => {
    let cancelled = false
    if (user && favoriteIds.length > 0) {
      supabase.from('movies').select('id, title, year, imdb_rating, poster')
        .in('id', favoriteIds)
        .then(({ data }) => {
          if (!cancelled) setFavoriteMovies(data || [])
        })
    } else {
      setFavoriteMovies([])
    }
    return () => { cancelled = true }
  }, [user?.id, favoriteIds.join(',')])

  useEffect(() => {
    let cancelled = false
    if (user && watchlistIds.length > 0) {
      supabase.from('movies').select('id, title, year, imdb_rating, poster')
        .in('id', watchlistIds)
        .then(({ data }) => {
          if (!cancelled) setWatchlistMovies(data || [])
        })
    } else {
      setWatchlistMovies([])
    }
    return () => { cancelled = true }
  }, [user?.id, watchlistIds.join(',')])

  useEffect(() => {
    let cancelled = false
    if (user && recentIds.length > 0) {
      supabase.from('movies').select('id, title, year, imdb_rating, poster')
        .in('id', recentIds)
        .then(({ data }) => {
          const ordered = recentIds.map(id => data?.find(m => m.id === id)).filter(Boolean)
          if (!cancelled) setRecentMovies(ordered)
        })
    } else {
      setRecentMovies([])
    }
    return () => { cancelled = true }
  }, [user?.id, recentIds.join(',')])

  useEffect(() => {
    let cancelled = false
    if (user && watchedIds.length > 0) {
      supabase.from('movies').select('id, title, year, imdb_rating, poster')
        .in('id', watchedIds)
        .then(({ data }) => {
          const ordered = watchedIds.map(id => data?.find(m => m.id === id)).filter(Boolean)
          if (!cancelled) setWatchedMovies(ordered)
        })
    } else {
      setWatchedMovies([])
    }
    return () => { cancelled = true }
  }, [user?.id, watchedIds.join(',')])

  if (!user) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
        <Nav onBeginAlignment={openWizard} />

        <section style={{ padding: '200px 0', textAlign: 'center' }}>
          <div className="shell">
            <div className="eyebrow">Your Sky</div>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)', marginTop: 12 }}>
              Sign in to access your sky.
            </h2>
            <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)', fontSize: 16, marginTop: 16, maxWidth: '40ch', marginLeft: 'auto', marginRight: 'auto' }}>
              Your favorites, watchlist, and recently viewed stars are waiting.
            </p>
            <div className="gold-rule" style={{ margin: '32px auto', maxWidth: 200 }} />
            <Link to="/login" className="btn btn-gold" style={{ display: 'inline-block', textDecoration: 'none', marginTop: 8 }}>
              Sign In to Your Sky
            </Link>
            <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-mute)', fontSize: 13, marginTop: 16 }}>
              New here?{' '}
              <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Create an account</Link>
            </p>
          </div>
        </section>

        <Footer />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={openWizard} />

      {/* ── Hero ── */}
      <section style={{ padding: '140px 0 60px' }}>
        <div className="shell">
          <div className="eyebrow">Your Sky</div>
          <h1 style={{ fontFamily: 'var(--display)', fontWeight: 300, fontSize: 'clamp(42px,6vw,88px)', lineHeight: 0.94, letterSpacing: '-0.02em', color: 'var(--ink)', marginTop: 12 }}>
            Your personal sky.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)', fontSize: 17, marginTop: 16 }}>
            Every film you've touched leaves a trace.
          </p>

          <div style={{ marginBottom: 32, marginTop: 32 }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--ink-mute)' }}>
              Signed in as
            </p>
            <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink)', marginTop: 4 }}>
              {user.email}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '4px 12px', border: '1px solid var(--gold-deep)', borderRadius: 999, fontSize: 11, color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ✦ Active
            </div>
          </div>

          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ink-mute)' }}>
            {favoriteIds.length} favorites · {watchedIds.length} watched · {watchlistIds.length} planned
          </p>
        </div>
      </section>

      <div className="shell"><div className="gold-rule" /></div>

      <ProfileSection
        title="Favorites"
        subtitle="Films you've marked as favourites."
        emptyMsg="No favourites yet. Start exploring the sky."
        items={favoriteMovies}
      />
      <ProfileSection
        title="Watched"
        subtitle="Films you've marked as watched."
        emptyMsg="You haven't marked any films as watched yet."
        items={watchedMovies}
      />
      <ProfileSection
        title="Plan To Watch"
        subtitle="Films you want to watch."
        emptyMsg="Your plan to watch list is empty."
        items={watchlistMovies}
      />

      <Footer />
    </div>
  )
}
