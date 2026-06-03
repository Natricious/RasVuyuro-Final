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
      if (error) setError(error)
      else setCollections(
        (data || []).map(c => ({ ...c, name: c.title_en, description: c.description_en }))
      )
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [])

  return { collections, loading, error }
}
