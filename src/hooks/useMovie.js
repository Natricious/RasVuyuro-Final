import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export function useMovie(id) {
  const [movie, setMovie] = useState(null)
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function fetch() {
      setLoading(true)

      const { data, error: err } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return
      if (err || !data) { setError(err || new Error('Not found')); setLoading(false); return }
      setMovie(data)

      // Tier 1 — similar_movies field
      if (data.similar_movies && Array.isArray(data.similar_movies) && data.similar_movies.length > 0) {
        const { data: similarData } = await supabase
          .from('movies')
          .select('id, title, year, imdb_rating, genres, poster, tone, collections')
          .in('id', data.similar_movies.slice(0, 6))
          .order('imdb_rating', { ascending: false })
        if (!cancelled && similarData && similarData.length > 0) {
          setNearby(similarData)
          setLoading(false)
          return
        }
      }

      // Tier 2 — same collection
      if (data.collections && data.collections.length > 0) {
        const firstCollection = Array.isArray(data.collections) ? data.collections[0] : data.collections
        const { data: colData } = await supabase
          .from('movies')
          .select('id, title, year, imdb_rating, genres, poster, tone, collections')
          .contains('collections', [firstCollection])
          .neq('id', id)
          .order('imdb_rating', { ascending: false })
          .limit(6)
        if (!cancelled && colData && colData.length > 0) {
          setNearby(colData)
          setLoading(false)
          return
        }
      }

      // Tier 3 — top rated fallback
      const { data: topData } = await supabase
        .from('movies')
        .select('id, title, year, imdb_rating, genres, poster, tone, collections')
        .neq('id', id)
        .order('imdb_rating', { ascending: false })
        .limit(6)
      if (!cancelled && topData) setNearby(topData)

      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  return { movie, nearby, loading, error }
}
