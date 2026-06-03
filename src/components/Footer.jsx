import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="nav-name">Ras<em>Vuyuro</em></span>
            <p className="footer-tagline">A sky of films. One for you tonight.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <h6>Navigate</h6>
              <Link to="/">Home</Link>
              <Link to="/movies">Browse</Link>
              <Link to="/collections">Constellations</Link>
            </div>
            <div className="footer-col">
              <h6>Discover</h6>
              <Link to="/profile">My Sky</Link>
              <Link to="/movies">Wander</Link>
              <a href="#collections">Align Now</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="gold-rule" />
          <span className="footer-copy">RasVuyuro · Every evening, a different sky</span>
        </div>
      </div>
    </footer>
  )
}
