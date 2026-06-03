import { useEffect } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import CollectionField from '../components/CollectionField'
import FilmAnatomy from '../components/FilmAnatomy'
import MotionShowcase from '../components/MotionShowcase'
import Philosophy from '../components/Philosophy'
import Footer from '../components/Footer'

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('.obs')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in')
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Nav />
      <Hero />
      <CollectionField />
      <FilmAnatomy />
      <MotionShowcase />
      <Philosophy />
      <Footer />
    </div>
  )
}
