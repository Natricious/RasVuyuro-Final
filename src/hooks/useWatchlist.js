import { useState, useEffect } from 'react'

const KEY = 'rv_watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(watchlist))
  }, [watchlist])

  const isInWatchlist = (id) => watchlist.some(m => m.id === id)

  const toggleWatchlist = (movie) => {
    setWatchlist(prev =>
      prev.some(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [{ id: movie.id, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }, ...prev]
    )
  }

  return { watchlist, isInWatchlist, toggleWatchlist }
}
