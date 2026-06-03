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

      if (data.collections && data.collections.length > 0) {
        const firstCollection = Array.isArray(data.collections) ? data.collections[0] : data.collections
        const { data: nearbyData } = await supabase
          .from('movies')
          .select('id, title, year, imdb_rating, genres, poster, tone, collections')
          .contains('collections', [firstCollection])
          .neq('id', id)
          .order('imdb_rating', { ascending: false })
          .limit(3)
        if (!cancelled && nearbyData) setNearby(nearbyData)
      }

      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  return { movie, nearby, loading, error }
}
