import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import CollectionField from '../components/CollectionField'
import FilmAnatomy from '../components/FilmAnatomy'
import MotionShowcase from '../components/MotionShowcase'
import Philosophy from '../components/Philosophy'
import Footer from '../components/Footer'
import WizardPanel from '../components/WizardPanel'

export default function Home() {
  const [wizardOpen, setWizardOpen] = useState(false)

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
      <Nav onBeginAlignment={() => setWizardOpen(true)} />
      <Hero onBeginAlignment={() => setWizardOpen(true)} />
      <CollectionField />
      <FilmAnatomy />
      <MotionShowcase />
      <Philosophy />
      <Footer />
      <WizardPanel isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  )
}
