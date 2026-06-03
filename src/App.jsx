import { useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import SkyEngine from './engine/SkyEngine'
import Home from './pages/Home'
import Browse from './pages/Browse'
import MovieDetail from './pages/MovieDetail'
import CollectionDetail from './pages/CollectionDetail'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const engine = new SkyEngine(canvasRef.current)
    engine.start()
    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)
    return () => {
      engine.stop()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <BrowserRouter basename="/RasVuyuro-Final">
      <canvas id="sky" ref={canvasRef} />
      <div className="grain" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Browse />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/collections" element={<CollectionDetail />} />
        <Route path="/collections/:slug" element={<CollectionDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
