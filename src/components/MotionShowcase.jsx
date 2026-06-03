const DRIFT_DOTS = [
  { cx: 12,  cy: 22, r: 1.8, dur: 2.0, delay: 0    },
  { cx: 38,  cy: 52, r: 1.4, dur: 2.7, delay: 0.25 },
  { cx: 62,  cy: 32, r: 1.0, dur: 1.6, delay: 0.1  },
  { cx: 86,  cy: 60, r: 2.0, dur: 3.1, delay: 0.4  },
  { cx: 108, cy: 40, r: 1.5, dur: 2.3, delay: 0.15 },
]

const TRACE_PTS = [[15,60],[36,24],[62,44],[88,18],[108,50]]
const ALIGN_PTS = [[20,40],[56,18],[92,40],[72,66],[38,66]]

const TRAVEL_DOTS = [
  { dx:  32, dy:   0, delay: 0    },
  { dx:  23, dy: -22, delay: 0.3  },
  { dx:   0, dy: -30, delay: 0.6  },
  { dx: -23, dy: -22, delay: 0.9  },
  { dx: -32, dy:   0, delay: 1.2  },
  { dx: -23, dy:  22, delay: 1.5  },
  { dx:   0, dy:  30, delay: 1.8  },
  { dx:  23, dy:  22, delay: 2.1  },
]

function DriftDemo() {
  return (
    <svg viewBox="0 0 120 80" width="100%" height={80}>
      {DRIFT_DOTS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
          fill="#c9a14a" opacity="0.7"
          style={{
            animation: `driftStar ${d.dur}s ease-in-out infinite alternate`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </svg>
  )
}

function PullDemo() {
  return (
    <svg viewBox="0 0 120 80" width="100%" height={80}>
      <circle cx="60" cy="40" r="5"  fill="#c9a14a" opacity="0.9" />
      <circle cx="60" cy="40" r="18" fill="none" stroke="#c9a14a" strokeWidth="0.6" opacity="0.25" />
      {[0,1,2,3].map(i => {
        const angle = (i / 4) * Math.PI * 2
        const cx = Math.round(60 + Math.cos(angle) * 26)
        const cy = Math.round(40 + Math.sin(angle) * 18)
        return (
          <circle key={i} cx={cx} cy={cy} r="2.2"
            fill="#c9a14a" opacity="0.6"
            style={{
              animation: `driftStar ${1.8 + i * 0.35}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        )
      })}
    </svg>
  )
}

function TraceDemo() {
  const pts = TRACE_PTS.map(p => p.join(',')).join(' ')
  return (
    <svg viewBox="0 0 120 80" width="100%" height={80}>
      <polyline points={pts} fill="none" stroke="#c9a14a" strokeWidth="1" opacity="0.55"
        strokeDasharray="300" strokeDashoffset="300"
        style={{ animation: 'traceDraw 2.8s ease-in-out infinite' }} />
      {TRACE_PTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.8" fill="#c9a14a" opacity="0.8" />
      ))}
    </svg>
  )
}

function BloomDemo() {
  return (
    <svg viewBox="0 0 120 80" width="100%" height={80}>
      <style>{`
        @keyframes bloomScale {
          from { transform: scale(0.1); opacity: 0.8; }
          to   { transform: scale(6);   opacity: 0;   }
        }
      `}</style>
      <circle cx="60" cy="40" r="5" fill="#c9a14a" opacity="0.9" />
      {[0, 0.65, 1.3].map((delay, i) => (
        <circle key={i} cx="60" cy="40" r="6" fill="none"
          stroke="#c9a14a" strokeWidth="1.2"
          style={{
            animation: `bloomScale 2s ease-out infinite`,
            animationDelay: `${delay}s`,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        />
      ))}
    </svg>
  )
}

function TravelDemo() {
  return (
    <svg viewBox="0 0 120 80" width="100%" height={80} style={{ overflow: 'hidden' }}>
      <style>{`
        @keyframes travelZoom {
          0%   { transform: translate(0, 0) scale(0.1); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate(calc(var(--dx) * 1px), calc(var(--dy) * 1px)) scale(1.5); opacity: 0; }
        }
      `}</style>
      {TRAVEL_DOTS.map((d, i) => (
        <circle key={i} cx="60" cy="40" r="2" fill="#c9a14a"
          style={{
            '--dx': d.dx,
            '--dy': d.dy,
            animation: 'travelZoom 2.4s linear infinite',
            animationDelay: `${d.delay}s`,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        />
      ))}
      <circle cx="60" cy="40" r="3" fill="#c9a14a" opacity="0.9" />
    </svg>
  )
}

function AlignDemo() {
  const pts = ALIGN_PTS.map(p => p.join(',')).join(' ')
  return (
    <svg viewBox="0 0 120 80" width="100%" height={80}>
      <polyline points={pts} fill="none" stroke="#c9a14a" strokeWidth="0.7" opacity="0.38"
        strokeDasharray="260" strokeDashoffset="260"
        style={{ animation: 'traceDraw 3s ease-in-out infinite', animationDelay: '0.8s' }} />
      {ALIGN_PTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="#c9a14a"
          style={{ animation: 'alignDot 3s ease-out infinite', animationDelay: `${i * 0.48}s` }}
        />
      ))}
    </svg>
  )
}

const CARDS = [
  { num: '01', title: 'Stellar Drift',       desc: 'Stars move with depth. Closer ones drift faster.',                Demo: DriftDemo  },
  { num: '02', title: 'Gravitational Pull',  desc: 'Films pull toward you as you approach.',                          Demo: PullDemo   },
  { num: '03', title: 'Constellation Trace', desc: 'Lines connect as you explore a sky.',                             Demo: TraceDemo  },
  { num: '04', title: 'Star Bloom',          desc: 'A film reveals itself with a bloom.',                             Demo: BloomDemo  },
  { num: '05', title: 'Sky Travel',          desc: 'Flying into a constellation warps the sky.',                      Demo: TravelDemo },
  { num: '06', title: 'Alignment',           desc: 'The Wizard aligns stars to your answer.',                         Demo: AlignDemo  },
]

export default function MotionShowcase() {
  return (
    <section className="motion-section">
      <div className="shell">
        <div className="obs section-head">
          <div className="eyebrow">iii · How it moves</div>
          <h2>Motion is meaning.</h2>
          <p>
            Every interaction in RasVuyuro has a physical logic. Stars drift.
            Constellations breathe. The sky responds.
          </p>
        </div>

        <div className="motion-grid obs">
          {CARDS.map(({ num, title, desc, Demo }) => (
            <div key={num} className="mcard">
              <div className="mcard-demo"><Demo /></div>
              <span className="mnum">{num}</span>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
