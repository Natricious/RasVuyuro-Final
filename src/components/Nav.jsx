import { Link } from 'react-router-dom'

export default function Nav({ onBeginAlignment }) {
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <span className="nav-dot" />
        <span className="nav-name">Ras<em>Vuyuro</em></span>
      </Link>
      <div className="nav-links">
        <Link to="/movies" className="nav-link">Wander</Link>
        <Link to="/collections" className="nav-link">Constellations</Link>
        <button className="nav-link nav-pill" onClick={onBeginAlignment}>Begin the Alignment</button>
      </div>
    </nav>
  )
}
