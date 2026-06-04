import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const LS_KEY = 'rv_watched'
const MAX = 20

export function useWatched() {
  const { user } = useAuth()
  const [watchedIds, setWatchedIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
        setWatchedIds(stored.map(m => m.id || m))
      } catch { setWatchedIds([]) }
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('user_lists')
      .select('movie_id')
      .eq('user_id', user.id)
      .eq('list_type', 'watched')
      .order('created_at', { ascending: false })
      .limit(MAX)
      .then(({ data }) => {
        if (cancelled) return
        setWatchedIds(data ? data.map(r => r.movie_id) : [])
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [user?.id])

  const isWatched = (id) => watchedIds.includes(Number(id))

  const toggleWatched = async (movie) => {
    const movieId = Number(movie.id)
    if (user) {
      if (isWatched(movieId)) {
        await supabase.from('user_lists').delete()
          .eq('user_id', user.id).eq('movie_id', movieId).eq('list_type', 'watched')
        setWatchedIds(prev => prev.filter(id => id !== movieId))
      } else {
        await supabase.from('user_lists').insert({ user_id: user.id, movie_id: movieId, list_type: 'watched' })
        setWatchedIds(prev => [movieId, ...prev])
      }
    } else {
      const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
      const exists = stored.some(m => (m.id || m) === movieId)
      const updated = exists
        ? stored.filter(m => (m.id || m) !== movieId)
        : [{ id: movieId, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }, ...stored].slice(0, MAX)
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      setWatchedIds(updated.map(m => m.id || m))
    }
  }

  return { watchedIds, isWatched, toggleWatched, loading }
}
