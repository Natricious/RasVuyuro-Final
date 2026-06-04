import { useRef, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import SkyEngine from './engine/SkyEngine'
import WizardPanel from './components/WizardPanel'
import Home from './pages/Home'
import Browse from './pages/Browse'
import MovieDetail from './pages/MovieDetail'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import Profile from './pages/Profile'
import Login from './pages/Login'
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
  const [wizardOpen, setWizardOpen] = useState(false)
  const openWizard = () => setWizardOpen(true)

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
        <Route path="/" element={<Home openWizard={openWizard} />} />
        <Route path="/movies" element={<Browse openWizard={openWizard} />} />
        <Route path="/movie/:id" element={<MovieDetail openWizard={openWizard} />} />
        <Route path="/collections" element={<Collections openWizard={openWizard} />} />
        <Route path="/collections/:slug" element={<CollectionDetail openWizard={openWizard} />} />
        <Route path="/profile" element={<Profile openWizard={openWizard} />} />
        <Route path="/login" element={<Login openWizard={openWizard} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WizardPanel isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </BrowserRouter>
  )
}

export default App
