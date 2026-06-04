import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const INPUT_STYLE = {
  width: '100%',
  padding: '14px 18px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--line-strong)',
  borderRadius: 12,
  color: 'var(--ink)',
  fontFamily: 'var(--sans)',
  fontSize: 15,
  outline: 'none',
  marginBottom: 12,
  boxSizing: 'border-box',
  transition: 'border-color 0.3s var(--ease)',
}

export default function Login({ openWizard }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [googleError, setGoogleError] = useState(null)
  const [googleHover, setGoogleHover] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit() {
    setError(null)
    setSuccess(null)
    setLoading(true)
    const fn = mode === 'signin' ? signIn : signUp
    const { error: err } = await fn(email, password)
    setLoading(false)
    if (err) { setError(err.message); return }
    if (mode === 'signup') { setSuccess('Check your email to confirm your account.'); return }
    navigate('/')
  }

  async function handleGoogle() {
    setGoogleError(null)
    const { error: err } = await signInWithGoogle()
    if (err) setGoogleError(err.message)
  }

  const switchMode = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError(null)
    setSuccess(null)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      <Nav onBeginAlignment={openWizard} />

      <section style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="shell" style={{ maxWidth: 480, margin: '0 auto', padding: '60px 0', width: '100%' }}>
          <div className="eyebrow">{mode === 'signin' ? 'Welcome back' : 'Join the sky'}</div>

          <h1 style={{
            fontFamily: 'var(--display)', fontWeight: 300,
            fontSize: 'clamp(32px,5vw,52px)',
            lineHeight: 0.94, letterSpacing: '-0.02em',
            color: 'var(--ink)', marginTop: 12,
          }}>
            {mode === 'signin' ? 'Sign in to your sky.' : 'Create your sky.'}
          </h1>

          <p style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)', fontSize: 16, marginTop: 12 }}>
            Your constellations, your stars, your evening.
          </p>

          <div className="gold-rule" style={{ margin: '32px 0' }} />

          <button
            onClick={handleGoogle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,161,74,0.06)'; setGoogleHover(true) }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; setGoogleHover(false) }}
            style={{
              width: '100%', padding: '14px 18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--line-strong)',
              borderRadius: 12,
              color: 'var(--ink)', fontFamily: 'var(--sans)', fontSize: 14,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.3s var(--ease)',
              marginBottom: 20,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill={googleHover ? 'var(--gold-bright)' : 'var(--gold)'} d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.565 2.684-3.875 2.684-6.615z"/>
              <path fill={googleHover ? 'var(--gold-bright)' : 'var(--gold)'} d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill={googleHover ? 'var(--gold-bright)' : 'var(--gold)'} d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z"/>
              <path fill={googleHover ? 'var(--gold-bright)' : 'var(--gold)'} d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          {googleError && (
            <p style={{ color: '#e07070', fontSize: 13, marginBottom: 12, fontFamily: 'var(--sans)' }}>
              {googleError}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span style={{ color: 'var(--ink-mute)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--sans)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={INPUT_STYLE}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line-strong)' }}
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="password"
            style={INPUT_STYLE}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--line-strong)' }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          />

          {error && (
            <p style={{ color: '#e07070', fontSize: 13, marginBottom: 12, fontFamily: 'var(--sans)' }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: 'var(--gold)', fontSize: 13, marginBottom: 12, fontFamily: 'var(--sans)' }}>
              {success}
            </p>
          )}

          <button
            className="btn btn-gold"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', marginTop: 8, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Aligning…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ marginTop: 20, textAlign: 'center', color: 'var(--ink-mute)', fontSize: 13, fontFamily: 'var(--sans)' }}>
            {mode === 'signin' ? (
              <>New to the sky?{' '}
                <button onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--sans)' }}>
                  Create an account
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--sans)' }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
