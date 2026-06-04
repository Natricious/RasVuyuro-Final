import { useState, useEffect } from 'react'

const KEY = 'rv_recent'
const MAX = 20

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addToRecent = (movie) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(m => m.id !== movie.id)
      const entry = { id: movie.id, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }
      return [entry, ...filtered].slice(0, MAX)
    })
  }

  return { recentlyViewed, addToRecent }
}
