import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export function useMovies({ search = '', page = 0, pageSize = 50, genre = '', collection = '', minRating = 0 } = {}) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      let query = supabase
        .from('movies')
        .select('id, title, year, imdb_rating, genres, poster, tone, collections')
        .order('imdb_rating', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)
      if (genre)         query = query.contains('genres', [genre])
      if (collection)    query = query.contains('collections', [collection])
      if (minRating > 0) query = query.gte('imdb_rating', minRating)

      const { data, error: err } = await query
      if (cancelled) return
      if (err) { setError(err); setLoading(false); return }
      setMovies(data || [])
      setHasMore((data || []).length === pageSize)
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [search, page, pageSize, genre, collection, minRating])

  return { movies, loading, error, hasMore }
}

export function useFilterOptions() {
  const [genres, setGenres] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      const { data: movies } = await supabase
        .from('movies')
        .select('genres')
        .not('genres', 'is', null)
        .limit(500)

      const { data: cols } = await supabase
        .from('collections')
        .select('title_en, slug')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })

      if (cancelled) return

      const genreSet = new Set()
      if (movies) movies.forEach(m => {
        const g = Array.isArray(m.genres) ? m.genres : (m.genres ? [m.genres] : [])
        g.forEach(x => x && genreSet.add(x))
      })
      setGenres([...genreSet].sort())
      setCollections((cols || []).map(c => ({ slug: c.slug, name: c.title_en })))
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  return { genres, collections, loading }
}
