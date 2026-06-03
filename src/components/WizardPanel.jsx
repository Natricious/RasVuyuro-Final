import { useEffect, useState } from 'react'

const OPTIONS = [
  { label: 'Escape',     sub: 'take me somewhere else entirely' },
  { label: 'Wonder',     sub: "show me something I haven't felt before" },
  { label: 'Comfort',    sub: 'something warm and familiar' },
  { label: 'Tension',    sub: 'keep me on the edge' },
  { label: 'Reflection', sub: 'I want to think afterwards' },
  { label: 'Adventure',  sub: 'motion, risk, discovery' },
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
  .wiz-option:hover {
    border-color: var(--line-strong);
    background: rgba(255,255,255,0.04);
  }
  .wiz-option--selected {
    border-color: var(--gold);
    background: var(--gold-glow);
  }
  .wiz-option-text { display: flex; flex-direction: column; gap: 3px; }
  .wiz-option-label {
    font-family: var(--sans);
    font-size: 16px;
    font-weight: 500;
    color: var(--ink);
    transition: color 0.25s var(--ease);
  }
  .wiz-option--selected .wiz-option-label { color: var(--gold); }
  .wiz-option-sub {
    font-family: var(--sans);
    font-size: 13px;
    color: var(--ink-mute);
  }
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
  .wiz-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 32px;
  }
  .wiz-dot {
    border-radius: 50%;
    display: inline-block;
    background: var(--line-strong);
    width: 6px;
    height: 6px;
    transition: all 0.3s var(--ease);
  }
  .wiz-dot--active {
    width: 8px;
    height: 8px;
    background: var(--gold);
    box-shadow: 0 0 8px 2px var(--gold-glow);
  }
  .wiz-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 48px;
  }
  .wiz-back { opacity: 0.3; pointer-events: none; }
  .wiz-next--disabled { opacity: 0.35; pointer-events: none; }
`

export default function WizardPanel({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      const t = setTimeout(() => {
        setMounted(false)
        setSelected(null)
      }, 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!mounted) return null

  return (
    <div
      className={`wiz-overlay${visible ? ' wiz-visible' : ''}`}
      onClick={onClose}
    >
      <style>{WIZ_CSS}</style>
      <div className="wiz-panel" onClick={e => e.stopPropagation()}>
        <button className="wiz-close" onClick={onClose}>×</button>

        <div className="eyebrow">The Alignment · Point 1 of 4</div>

        <h2 style={{
          fontFamily: 'var(--display)',
          fontWeight: 300,
          fontSize: 'clamp(28px,4vw,48px)',
          marginTop: 16,
          lineHeight: 1.1,
          color: 'var(--ink)',
        }}>
          What do you seek tonight?
        </h2>

        <p style={{
          fontFamily: 'var(--sans)',
          color: 'var(--ink-soft)',
          fontSize: 15,
          marginTop: 12,
        }}>
          Choose the feeling you want to carry out of the evening.
        </p>

        <div className="wiz-options">
          {OPTIONS.map(({ label, sub }) => (
            <button
              key={label}
              className={`wiz-option${selected === label ? ' wiz-option--selected' : ''}`}
              onClick={() => setSelected(label)}
            >
              <div className="wiz-option-text">
                <span className="wiz-option-label">{label}</span>
                <span className="wiz-option-sub">{sub}</span>
              </div>
              <span className="wiz-radio" />
            </button>
          ))}
        </div>

        <div className="wiz-dots">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`wiz-dot${i === 0 ? ' wiz-dot--active' : ''}`} />
          ))}
        </div>

        <div className="wiz-footer">
          <button className="btn btn-ghost wiz-back" disabled>← Back</button>
          <button
            className={`btn btn-gold${selected === null ? ' wiz-next--disabled' : ''}`}
            onClick={() => console.log('selected:', selected)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
