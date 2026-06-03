import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

export function useCollections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      const { data, error } = await supabase
        .from('collections')
        .select('id, title_en, slug, description_en, image_url, is_visible, display_order')
        .eq('is_visible', true)
        .order('display_order', { ascending: true })
      if (cancelled) return
      if (error) { setError(error); setLoading(false); return }

      const { data: allMovies } = await supabase
        .from('movies')
        .select('collections')
      if (cancelled) return

      const countMap = {}
      if (allMovies) {
        allMovies.forEach(movie => {
          const cols = Array.isArray(movie.collections) ? movie.collections : []
          cols.forEach(slug => {
            countMap[slug] = (countMap[slug] || 0) + 1
          })
        })
      }

      const enriched = (data || []).map(col => ({
        ...col,
        name: col.title_en,
        description: col.description_en,
        movieCount: countMap[col.slug] || 0,
      }))
      setCollections(enriched)
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  return { collections, loading, error }
}
