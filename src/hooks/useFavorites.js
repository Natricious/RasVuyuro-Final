import { useState, useEffect } from 'react'

const KEY = 'rv_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = (id) => favorites.some(m => m.id === id)

  const toggleFavorite = (movie) => {
    setFavorites(prev =>
      prev.some(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [{ id: movie.id, title: movie.title, year: movie.year, poster: movie.poster, imdb_rating: movie.imdb_rating }, ...prev]
    )
  }

  return { favorites, isFavorite, toggleFavorite }
}
