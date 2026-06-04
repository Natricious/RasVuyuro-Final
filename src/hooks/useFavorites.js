import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const LS_KEY = 'rv_favorites'

export function useFavorites() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFavoriteIds([])
      setLoading(true)
      supabase
        .from('user_lists')
        .select('movie_id')
        .eq('user_id', user.id)
        .eq('list_type', 'favorite')
        .then(({ data }) => {
          setFavoriteIds(data ? data.map(r => r.movie_id) : [])
          setLoading(false)
        })
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
        setFavoriteIds(stored.map(m => m.id || m))
      } catch { setFavoriteIds([]) }
    }
  }, [user?.id])

  const isFavorite = (id) => favoriteIds.includes(Number(id))

  const toggleFavorite = async (movie) => {
    const movieId = Number(movie.id)
    if (user) {
      if (isFavorite(movieId)) {
        await supabase.from('user_lists').delete()
          .eq('user_id', user.id).eq('movie_id', movieId).eq('list_type', 'favorite')
        setFavoriteIds(prev => prev.filter(id => id !== movieId))
      } else {
        await supabase.from('user_lists').insert({ user_id: user.id, movie_id: movieId, list_type: 'favorite' })
        setFavoriteIds(prev => [...prev, movieId])
      }
    } else {
      const stored = JSON.parse(localStorage.getItem(LS_KEY)) || []
      const exists = stored.some(m => (m.id || m) === movieId)
      const updated = exists
        ? stored.filter(m => (m.id || m) !== movieId)
        : [{ id: movieId, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }, ...stored]
      localStorage.setItem(LS_KEY, JSON.stringify(updated))
      setFavoriteIds(updated.map(m => m.id || m))
    }
  }

  return { favoriteIds, isFavorite, toggleFavorite, loading }
}
