import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Nav({ onBeginAlignment }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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
        {user ? (
          <>
            <Link to="/profile" className="nav-link">My Sky</Link>
            <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { signOut(); navigate('/') }}>Sign Out</button>
          </>
        ) : (
          <Link to="/login" className="nav-link nav-pill">Sign In</Link>
        )}
      </div>
    </nav>
  )
}
