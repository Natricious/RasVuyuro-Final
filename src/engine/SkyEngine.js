const TAU = Math.PI * 2

function seeded(s) {
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

export default class SkyEngine {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.dpr = Math.min(devicePixelRatio, 2)
    this.t = 0
    this.mode = 'home'
    this.cam = { x: 0, y: 0, zoom: 0.82, tx: 0, ty: 0, tzoom: 0.82 }
    this.W = 0
    this.H = 0
    this._raf = null
    this._last = 0
    this._build()
    this.resize()
  }

  _build() {
    const rnd = seeded(7)
    const spectral = ['#dfe7ff', '#cdd6f5', '#eef2ff', '#fff4dd', '#ffe7c4', '#ffd8c6', '#e6dbff']
    const cloudTints = ['#3a3470', '#5a3a55', '#2a3a60', '#4a3a30', '#352f5a']

    this.clouds = Array.from({ length: 9 }, () => ({
      x: (rnd() - 0.5) * 4600,
      y: (rnd() - 0.5) * 3800,
      r: 700 + rnd() * 900,
      depth: 0.5 + rnd() * 0.3,
      tint: cloudTints[Math.floor(rnd() * cloudTints.length)],
      opacity: 0.05 + rnd() * 0.06,
      drift: rnd() * TAU,
    }))

    this.stars = Array.from({ length: 980 }, () => {
      const mag = Math.pow(rnd(), 2.2)
      return {
        x: (rnd() - 0.5) * 5400,
        y: (rnd() - 0.5) * 4400,
        r: 0.3 + 2.0 * mag,
        depth: 0.16 + rnd() * 0.55,
        ph: rnd() * TAU,
        tw: 0.22 + rnd() * 0.70,
        color: spectral[Math.floor(rnd() * spectral.length)],
        mag: 0.3 + rnd() * 0.7,
      }
    })
  }

  resize() {
    const { dpr } = this
    this.W = window.innerWidth
    this.H = window.innerHeight
    this.canvas.width = this.W * dpr
    this.canvas.height = this.H * dpr
    this.canvas.style.width = this.W + 'px'
    this.canvas.style.height = this.H + 'px'
    // setTransform instead of scale so repeated resize() calls don't compound
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  frame(dt) {
    this.t += dt
    const { ctx, W, H } = this
    ctx.clearRect(0, 0, W, H)
    this._drawClouds()
    this._drawBgStars()
  }

  _drawClouds() {
    const { ctx, cam, W, H } = this
    for (const c of this.clouds) {
      const sx = (c.x - cam.x * c.depth) * cam.zoom + W / 2
      const sy = (c.y - cam.y * c.depth) * cam.zoom + H / 2
      const sr = c.r * cam.zoom
      if (sx + sr < 0 || sx - sr > W || sy + sr < 0 || sy - sr > H) continue
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
      grad.addColorStop(0, hexToRgba(c.tint, c.opacity))
      grad.addColorStop(1, hexToRgba(c.tint, 0))
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, TAU)
      ctx.fillStyle = grad
      ctx.fill()
    }
  }

  _drawBgStars() {
    const { ctx, cam, W, H, t } = this
    for (const s of this.stars) {
      const sx = (s.x - cam.x * s.depth) * cam.zoom + W / 2
      const sy = (s.y - cam.y * s.depth) * cam.zoom + H / 2
      const margin = s.r * 3 + 4
      if (sx < -margin || sx > W + margin || sy < -margin || sy > H + margin) continue
      const alpha = s.mag * (0.55 + 0.45 * Math.sin(t * s.tw * TAU + s.ph))
      ctx.globalAlpha = alpha
      ctx.fillStyle = s.color
      ctx.beginPath()
      ctx.arc(sx, sy, s.r, 0, TAU)
      ctx.fill()
      if (s.mag > 0.7) {
        ctx.globalAlpha = alpha * 0.3
        ctx.beginPath()
        ctx.arc(sx, sy, s.r * 2.5, 0, TAU)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }

  start() {
    this._last = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - this._last) / 1000)
      this._last = now
      this.frame(dt)
      this._raf = requestAnimationFrame(tick)
    }
    this._raf = requestAnimationFrame(tick)
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf)
  }
}
