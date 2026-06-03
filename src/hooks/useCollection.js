import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export function useCollection(slug) {
  const [collection, setCollection] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      const { data: col, error: colErr } = await supabase
        .from('collections')
        .select('id, title_en, slug, description_en, image_url, display_order')
        .eq('slug', slug)
        .single()
      if (cancelled) return
      if (colErr || !col) { setError(colErr || new Error('Not found')); setLoading(false); return }
      setCollection({ ...col, name: col.title_en, description: col.description_en })

      const { data: films, error: filmErr } = await supabase
        .from('movies')
        .select('id, title, year, imdb_rating, genres, poster, description_ka, description, tone, themes')
        .contains('collections', [slug])
        .order('imdb_rating', { ascending: false })
        .limit(50)
      if (cancelled) return
      if (!filmErr) setMovies(films || [])
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [slug])

  return { collection, movies, loading, error }
}
