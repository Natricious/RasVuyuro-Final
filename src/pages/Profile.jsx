import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

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
  const { favorites } = useFavorites()
  const { watchlist } = useWatchlist()
  const { recentlyViewed } = useRecentlyViewed()

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
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ink-mute)', marginTop: 32 }}>
            {favorites.length} favorites · {watchlist.length} in watchlist · {recentlyViewed.length} recently viewed
          </p>
        </div>
      </section>

      <div className="shell"><div className="gold-rule" /></div>

      <ProfileSection
        title="Favorites"
        subtitle="Films you've marked as favourites."
        emptyMsg="No favourites yet. Start exploring the sky."
        items={favorites}
      />
      <ProfileSection
        title="Watchlist"
        subtitle="Films you want to watch."
        emptyMsg="Your watchlist is empty. Find something worth watching."
        items={watchlist}
      />
      <ProfileSection
        title="Recently Viewed"
        subtitle="Stars you've visited."
        emptyMsg="You haven't visited any stars yet."
        items={recentlyViewed}
      />

      <Footer />
    </div>
  )
}
