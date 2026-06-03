import { useEffect, useState } from 'react'

const STEPS = [
  {
    key: 'feeling',
    q: 'What do you seek tonight?',
    hint: 'Choose the feeling you want to carry out of the evening.',
    options: [
      { label: 'Escape',     sub: 'take me somewhere else entirely' },
      { label: 'Wonder',     sub: "show me something I haven't felt before" },
      { label: 'Comfort',    sub: 'something warm and familiar' },
      { label: 'Tension',    sub: 'keep me on the edge' },
      { label: 'Reflection', sub: 'I want to think afterwards' },
      { label: 'Adventure',  sub: 'motion, risk, discovery' },
    ],
  },
  {
    key: 'energy',
    q: 'How much energy should the night have?',
    hint: 'The rhythm of the film — not the plot, the pulse.',
    options: [
      { label: 'Quiet',    sub: 'slow, breathing, unhurried' },
      { label: 'Balanced', sub: 'neither too still nor too loud' },
      { label: 'Intense',  sub: 'full presence required' },
    ],
  },
  {
    key: 'reality',
    q: 'How close do you want to stay to reality?',
    hint: 'How far should the sky take you?',
    options: [
      { label: 'Grounded',             sub: 'real places, real people, real weight' },
      { label: 'Somewhere between',    sub: 'heightened but recognisable' },
      { label: 'Completely elsewhere', sub: 'another world entirely' },
    ],
  },
  {
    key: 'company',
    q: 'Who is this evening for?',
    hint: 'The sky aligns differently for different orbits.',
    options: [
      { label: 'Just me',           sub: 'a private evening' },
      { label: 'Someone beside me', sub: 'shared but intimate' },
      { label: 'A group',           sub: 'something for everyone to feel together' },
    ],
  },
]

const ANSWER_ROWS = [
  { label: 'Seeking',  key: 'feeling' },
  { label: 'Energy',   key: 'energy'  },
  { label: 'Reality',  key: 'reality' },
  { label: 'Company',  key: 'company' },
]

const WIZ_CSS = `
  .wiz-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(4,4,10,0.88);
    backdrop-filter: blur(12px);
    opacity: 0;
    transition: opacity 300ms ease;
  }
  .wiz-overlay.wiz-visible { opacity: 1; }
  .wiz-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 20px));
    width: min(640px, 90vw);
    background: rgba(14,13,22,0.95);
    border: 1px solid var(--line-strong);
    border-radius: 24px;
    padding: 56px 48px;
    z-index: 101;
    transition: transform 400ms var(--slow);
    max-height: 90vh;
    overflow-y: auto;
  }
  .wiz-overlay.wiz-visible .wiz-panel { transform: translate(-50%, -50%); }
  .wiz-close {
    position: absolute;
    top: 20px;
    right: 24px;
    background: none;
    border: none;
    color: var(--ink-mute);
    font-size: 22px;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
    padding: 4px;
  }
  .wiz-close:hover { color: var(--ink); }
  .wiz-options { display: flex; flex-direction: column; gap: 10px; margin-top: 32px; }
  .wiz-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 20px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    text-align: left;
    transition: all 0.25s var(--ease);
  }
  .wiz-option:hover { border-color: var(--line-strong); background: rgba(255,255,255,0.04); }
  .wiz-option--selected { border-color: var(--gold); background: var(--gold-glow); }
  .wiz-option-text { display: flex; flex-direction: column; gap: 3px; }
  .wiz-option-label {
    font-family: var(--sans);
    font-size: 16px;
    font-weight: 500;
    color: var(--ink);
    transition: color 0.25s var(--ease);
  }
  .wiz-option--selected .wiz-option-label { color: var(--gold); }
  .wiz-option-sub { font-family: var(--sans); font-size: 13px; color: var(--ink-mute); }
  .wiz-radio {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid var(--line);
    flex-shrink: 0;
    transition: all 0.25s var(--ease);
  }
  .wiz-option--selected .wiz-radio {
    background: var(--gold);
    border-color: var(--gold);
    box-shadow: 0 0 8px 2px var(--gold-glow);
  }
  .wiz-dots { display: flex; justify-content: center; gap: 10px; margin-top: 32px; }
  .wiz-dot {
    border-radius: 50%;
    display: inline-block;
    background: var(--line-strong);
    width: 6px;
    height: 6px;
    transition: all 0.3s var(--ease);
  }
  .wiz-dot--done { background: var(--gold); width: 6px; height: 6px; }
  .wiz-dot--active {
    width: 8px;
    height: 8px;
    background: var(--gold);
    box-shadow: 0 0 8px 2px var(--gold-glow);
  }
  .wiz-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 48px; }
  .wiz-back { opacity: 0.3; pointer-events: none; }
  .wiz-next--disabled { opacity: 0.35; pointer-events: none; }
  @keyframes starPulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.08); }
  }
  .reveal-enter {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 500ms var(--slow), transform 500ms var(--slow);
  }
  .reveal-enter.reveal-in {
    opacity: 1;
    transform: scale(1);
  }
  .reveal-star {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--gold-bright), var(--gold-deep));
    box-shadow: 0 0 40px var(--gold), 0 0 80px rgba(201,161,74,0.3);
    margin: 0 auto 32px;
    animation: starPulse 3s ease-in-out infinite;
  }
  .reveal-summary {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 20px 24px;
    text-align: left;
    margin-bottom: 32px;
  }
  .reveal-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px 0;
    border-bottom: 1px solid var(--line);
  }
  .reveal-row:last-child { border-bottom: none; }
  .reveal-row-label {
    font-family: var(--sans);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--ink-mute);
  }
  .reveal-row-value {
    font-family: var(--sans);
    font-size: 15px;
    font-weight: 500;
    color: var(--ink);
  }
  .reveal-btns {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
`

export default function WizardPanel({ isOpen, onClose }) {
  const [mounted, setMounted]           = useState(false)
  const [visible, setVisible]           = useState(false)
  const [step, setStep]                 = useState(0)
  const [contentVisible, setContentVisible] = useState(true)
  const [answers, setAnswers]           = useState({})
  const [phase, setPhase]               = useState('questions')
  const [revealIn, setRevealIn]         = useState(false)

  // Reveal entrance animation
  useEffect(() => {
    if (phase === 'reveal') {
      const t = setTimeout(() => setRevealIn(true), 30)
      return () => clearTimeout(t)
    }
    setRevealIn(false)
  }, [phase])

  // Overlay open / close lifecycle
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      const t = setTimeout(() => {
        setMounted(false)
        setStep(0)
        setAnswers({})
        setPhase('questions')
        setContentVisible(true)
      }, 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ESC key
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!mounted) return null

  const current   = STEPS[step]
  const selection = answers[current.key] ?? null
  const isLast    = step === STEPS.length - 1

  const handleOption = (label) =>
    setAnswers(prev => ({ ...prev, [current.key]: label }))

  const goToStep = (next) => {
    setContentVisible(false)
    setTimeout(() => {
      setStep(next)
      setContentVisible(true)
    }, 200)
  }

  const handleNext = () => {
    if (isLast) {
      setPhase('reveal')
    } else {
      goToStep(step + 1)
    }
  }

  const handleBackToQuestions = () => {
    setPhase('questions')
    setStep(3)
  }

  const handleCloseAndReset = () => {
    setStep(0)
    setAnswers({})
    setPhase('questions')
    setContentVisible(true)
    onClose()
  }

  return (
    <div
      className={`wiz-overlay${visible ? ' wiz-visible' : ''}`}
      onClick={onClose}
    >
      <style>{WIZ_CSS}</style>
      <div className="wiz-panel" onClick={e => e.stopPropagation()}>
        <button className="wiz-close" onClick={onClose}>×</button>

        {phase === 'reveal' ? (
          /* ── Reveal screen ── */
          <div className={`reveal-enter${revealIn ? ' reveal-in' : ''}`}
            style={{ textAlign: 'center', padding: '16px 0' }}
          >
            <div className="reveal-star" />

            <h2 style={{
              fontFamily: 'var(--display)',
              fontWeight: 300,
              fontSize: 'clamp(24px,3.5vw,40px)',
              color: 'var(--ink)',
              marginBottom: 16,
            }}>
              A star has answered.
            </h2>

            <p style={{
              fontFamily: 'var(--sans)',
              color: 'var(--ink-soft)',
              fontSize: 15,
              marginBottom: 32,
            }}>
              The sky aligned itself around your evening.
            </p>

            <div className="reveal-summary">
              {ANSWER_ROWS.map(({ label, key }, i) => (
                <div key={key} className="reveal-row">
                  <span className="reveal-row-label">{label}</span>
                  <span className="reveal-row-value">{answers[key] ?? '—'}</span>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--sans)',
              color: 'var(--ink-mute)',
              fontSize: 13,
              fontStyle: 'italic',
              marginBottom: 32,
            }}>
              Your film is being aligned. In Phase 5, this star will resolve
              into a real recommendation from the sky.
            </p>

            <div className="reveal-btns">
              <button className="btn btn-ghost" onClick={handleBackToQuestions}>
                ← Back to Alignment
              </button>
              <button className="btn btn-gold" onClick={handleCloseAndReset}>
                Close
              </button>
            </div>
          </div>
        ) : (
          /* ── Questions screen ── */
          <>
            <div style={{
              opacity: contentVisible ? 1 : 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: contentVisible ? 'auto' : 'none',
            }}>
              <div className="eyebrow">The Alignment · Point {step + 1} of 4</div>

              <h2 style={{
                fontFamily: 'var(--display)',
                fontWeight: 300,
                fontSize: 'clamp(28px,4vw,48px)',
                marginTop: 16,
                lineHeight: 1.1,
                color: 'var(--ink)',
              }}>
                {current.q}
              </h2>

              <p style={{
                fontFamily: 'var(--sans)',
                color: 'var(--ink-soft)',
                fontSize: 15,
                marginTop: 12,
              }}>
                {current.hint}
              </p>

              <div className="wiz-options">
                {current.options.map(({ label, sub }) => (
                  <button
                    key={label}
                    className={`wiz-option${selection === label ? ' wiz-option--selected' : ''}`}
                    onClick={() => handleOption(label)}
                  >
                    <div className="wiz-option-text">
                      <span className="wiz-option-label">{label}</span>
                      <span className="wiz-option-sub">{sub}</span>
                    </div>
                    <span className="wiz-radio" />
                  </button>
                ))}
              </div>
            </div>

            <div className="wiz-dots">
              {STEPS.map((_, i) => {
                let cls = 'wiz-dot'
                if (i < step) cls += ' wiz-dot--done'
                else if (i === step) cls += ' wiz-dot--active'
                return <span key={i} className={cls} />
              })}
            </div>

            <div className="wiz-footer">
              <button
                className={`btn btn-ghost${step === 0 ? ' wiz-back' : ''}`}
                disabled={step === 0}
                onClick={() => goToStep(step - 1)}
              >
                ← Back
              </button>
              <button
                className={`btn btn-gold${selection === null ? ' wiz-next--disabled' : ''}`}
                onClick={handleNext}
              >
                {isLast ? 'Reveal My Star ✦' : 'Next →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
