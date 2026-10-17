/**
 * Die Signatur der Seite: Die Überschrift entsteht aus Punkten.
 * Beim Laden ordnen sich verstreute Punkte einmal zu den Buchstaben
 * (vom Eindruck zur Wirkung). Der Mauszeiger bringt die Ordnung kurz
 * durcheinander, danach federt jeder Punkt an seinen Platz zurück.
 * Mit reduzierter Bewegung steht die Schrift sofort.
 */

type Punkt = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; v: number }

export function schriftfeld(box: HTMLElement) {
  const cv = box.querySelector('canvas')!
  const ersatz = box.querySelector<HTMLElement>('[data-ersatz]')
  const ctx = cv.getContext('2d')!
  const zeilen = [...box.querySelectorAll<HTMLElement>('[data-ersatz] > div')].map((d) => d.textContent ?? '')
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches
  const familie = "'Fraunces', Georgia, serif"
  let punkte: Punkt[] = [], punktgroesse = 1.7, w = 0, h = 0, start = 0, lauf = 0, aktiv = false
  const maus = { x: -9999, y: -9999 }

  function aufbauen() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    w = box.clientWidth
    const off = document.createElement('canvas')
    const o = off.getContext('2d')!
    // Fraunces passt die Buchstaben der Größe an (optische Größe), deshalb
    // wird bei der Zielgröße nachgemessen statt einmal linear hochgerechnet
    let groesse = 100
    for (let i = 0; i < 3; i++) {
      o.font = `300 ${groesse}px ${familie}`
      const breiteste = Math.max(...zeilen.map((z) => o.measureText(z).width))
      groesse = Math.min(240, groesse * (w * 0.94) / breiteste)
    }
    const zeilenhoehe = groesse * 0.96
    h = Math.ceil(zeilenhoehe * zeilen.length + groesse * 0.28)
    box.style.height = h + 'px'
    cv.width = w * dpr; cv.height = h * dpr
    cv.style.width = w + 'px'; cv.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Schrift einmal unsichtbar zeichnen und abtasten
    off.width = w; off.height = h
    o.fillStyle = '#fff'; o.font = `300 ${groesse}px ${familie}`; o.textBaseline = 'alphabetic'
    zeilen.forEach((z, i) => o.fillText(z, 0, groesse * 0.82 + i * zeilenhoehe))
    const daten = o.getImageData(0, 0, w, h).data
    const schritt = Math.max(2, Math.round(groesse / 44))
    punktgroesse = Math.max(1.2, schritt * 0.38)
    const alt = punkte
    punkte = []
    for (let y = 0; y < h; y += schritt) {
      for (let x = 0; x < w; x += schritt) {
        if (daten[(y * w + x) * 4 + 3] > 128) {
          const vorher = alt[punkte.length]
          punkte.push({
            tx: x, ty: y,
            x: vorher ? vorher.x : ruhig ? x : Math.random() * w,
            y: vorher ? vorher.y : ruhig ? y : (Math.random() * 1.6 - 0.3) * h,
            vx: 0, vy: 0, v: 0.6 + Math.random() * 0.4,
          })
        }
      }
    }
    if (ersatz) ersatz.style.opacity = '0'
  }

  function zeichnen(t: number) {
    if (!start) start = t
    const einlauf = ruhig ? 1 : Math.min(1, (t - start) / 2200)
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    for (const p of punkte) {
      // Federn zum Ziel, mit gestaffeltem Einlauf
      const k = 0.012 + 0.05 * einlauf * p.v
      let ax = (p.tx - p.x) * k, ay = (p.ty - p.y) * k
      const dx = p.x - maus.x, dy = p.y - maus.y, d2 = dx * dx + dy * dy
      if (d2 < 9000) { const f = (9000 - d2) / 9000 * 2.4; const d = Math.sqrt(d2) || 1; ax += dx / d * f; ay += dy / d * f }
      p.vx = (p.vx + ax) * 0.82; p.vy = (p.vy + ay) * 0.82
      p.x += p.vx; p.y += p.vy
      const ruhe = Math.min(1, 1 / (1 + Math.abs(p.x - p.tx) * 0.04))
      ctx.globalAlpha = 0.35 + 0.65 * ruhe
      ctx.fillRect(p.x, p.y, punktgroesse, punktgroesse)
    }
    ctx.globalAlpha = 1
    if (aktiv) lauf = requestAnimationFrame(zeichnen)
  }

  let breiteAlt = 0
  const neu = (erzwingen = false) => {
    if (erzwingen || box.clientWidth !== breiteAlt) { breiteAlt = box.clientWidth; aufbauen() }
  }

  document.fonts.load(`300 100px ${familie}`).finally(() => {
    neu(true)
    if (!ruhig) {
      cv.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); maus.x = e.clientX - r.left; maus.y = e.clientY - r.top })
      cv.addEventListener('pointerleave', () => { maus.x = maus.y = -9999 })
    }
    // Nur zeichnen, solange der Auftakt sichtbar ist
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !aktiv) { aktiv = true; lauf = requestAnimationFrame(zeichnen) }
      if (!e.isIntersecting) { aktiv = false; cancelAnimationFrame(lauf) }
    }).observe(cv)
  })
  addEventListener('resize', () => neu())
}
