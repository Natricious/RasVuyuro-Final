import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const LS_KEY = 'rv_watchlist'

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlistIds, setWatchlistIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setWatchlistIds([])
      setLoading(true)
      supabase
        .from('user_lists')
        .select('movie_id')
        .eq('user_id', user.id)
        .in('list_type', ['to_watch', 'watchlist'])
        .then(({ data }) => {
          setWatchlistIds(data ? data.map(r => r.movie_id) : [])
          setLoading(false)
        })
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
        setWatchlistIds(stored.map(m => m.id || m))
      } catch { setWatchlistIds([]) }
    }
  }, [user?.id])

  const isInWatchlist = (id) => watchlistIds.includes(Number(id))

  const toggleWatchlist = async (movie) => {
    const movieId = Number(movie.id)
    if (user) {
      if (isInWatchlist(movieId)) {
        await supabase.from('user_lists').delete()
          .eq('user_id', user.id).eq('movie_id', movieId).in('list_type', ['to_watch', 'watchlist'])
        setWatchlistIds(prev => prev.filter(id => id !== movieId))
      } else {
        await supabase.from('user_lists').insert({ user_id: user.id, movie_id: movieId, list_type: 'to_watch' })
        setWatchlistIds(prev => [...prev, movieId])
      }
    } else {
      const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
      const exists = stored.some(m => (m.id || m) === movieId)
      const updated = exists
        ? stored.filter(m => (m.id || m) !== movieId)
        : [{ id: movieId, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }, ...stored]
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      setWatchlistIds(updated.map(m => m.id || m))
    }
  }

  return { watchlistIds, isInWatchlist, toggleWatchlist, loading }
}
