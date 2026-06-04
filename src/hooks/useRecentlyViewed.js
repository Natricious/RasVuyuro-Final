import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const LS_KEY = 'rv_recent'
const MAX = 20

export function useRecentlyViewed() {
  const { user } = useAuth()
  const [recentIds, setRecentIds] = useState([])

  useEffect(() => {
    if (user) {
      setRecentIds([])
      supabase
        .from('user_lists')
        .select('movie_id')
        .eq('user_id', user.id)
        .eq('list_type', 'recently_viewed')
        .order('created_at', { ascending: false })
        .limit(MAX)
        .then(({ data }) => {
          setRecentIds(data ? data.map(r => r.movie_id) : [])
        })
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
        setRecentIds(stored.map(m => m.id || m))
      } catch { setRecentIds([]) }
    }
  }, [user?.id])

  const addToRecent = async (movie) => {
    const movieId = Number(movie.id)
    if (user) {
      await supabase.from('user_lists').delete()
        .eq('user_id', user.id).eq('movie_id', movieId).eq('list_type', 'recently_viewed')
      await supabase.from('user_lists').insert({ user_id: user.id, movie_id: movieId, list_type: 'recently_viewed' })
      setRecentIds(prev => [movieId, ...prev.filter(id => id !== movieId)].slice(0, MAX))
    } else {
      const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
      const filtered = stored.filter(m => (m.id || m) !== movieId)
      const entry = { id: movieId, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }
      const updated = [entry, ...filtered].slice(0, MAX)
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      setRecentIds(updated.map(m => m.id || m))
    }
  }

  return { recentIds, addToRecent }
}
