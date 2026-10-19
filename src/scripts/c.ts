// Variante Raster: die Stimme wird dort laut, wo der Zeiger ist; der Index folgt dem Lesen.
import { kern, gsap, ScrollTrigger, klemmen } from './kern'

export function start() {
  const { ruhig, lenis } = kern()
  document.querySelectorAll<HTMLElement>('.raster-linien span').forEach((s, i) => s.style.setProperty('--i', String(i)))

  const zeilen = [...document.querySelectorAll<HTMLElement>('[data-zeile]')]
  if (ruhig) { zeilen.forEach((z) => z.classList.add('ist-da')); return }

  // Stimme: jeder Buchstabe gewinnt Gewicht und Breite, je näher der Zeiger ist.
  // Ohne Maus läuft eine Welle, und schnelles Scrollen macht sie lauter.
  const buchstaben = [...document.querySelectorAll<HTMLElement>('[data-stimme] .b')]
  const stimme = document.querySelector<HTMLElement>('[data-stimme]')!
  const fein = matchMedia('(pointer: fine)').matches
  const zeiger = { x: -9999, y: -9999, aktiv: false }
  let mitten: { x: number; y: number }[] = []
  const messen = () => { mitten = buchstaben.map((b) => { const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY } }) }
  const werte = buchstaben.map(() => 200)
  window.addEventListener('pointermove', (e) => { zeiger.x = e.clientX; zeiger.y = e.clientY + scrollY; zeiger.aktiv = true })
  document.addEventListener('pointerleave', () => { zeiger.aktiv = false })
  document.fonts.ready.then(messen)
  window.addEventListener('resize', messen)
  let tempo = 0, sichtbar = true
  lenis?.on('scroll', (l: { velocity: number }) => { tempo = Math.min(1, Math.abs(l.velocity) / 40) })
  new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting }).observe(stimme)

  // Auftakt: einmal von links nach rechts laut werden
  const auftakt = { x: -0.2 }
  gsap.to(auftakt, { x: 1.2, duration: 2.2, ease: 'power2.inOut', delay: 0.3 })

  gsap.ticker.add((t) => {
    if (!sichtbar || !mitten.length) return
    const breite = window.innerWidth
    buchstaben.forEach((b, i) => {
      const m = mitten[i]
      let ziel = 200
      if (zeiger.aktiv && fein) {
        const d = Math.hypot(m.x - zeiger.x, m.y - zeiger.y)
        ziel = 200 + 700 * Math.max(0, 1 - d / (breite * 0.22))
      } else if (auftakt.x < 1.2) {
        const d = Math.abs(m.x / breite - auftakt.x)
        ziel = 200 + 700 * Math.max(0, 1 - d / 0.18)
      } else if (!fein) {
        const welle = (Math.sin(t * 1.4 - (m.x / breite) * 6) + 1) / 2
        ziel = 200 + 500 * welle * (0.5 + 0.5 * tempo) + 200 * tempo
      }
      werte[i] += (ziel - werte[i]) * 0.12
      b.style.setProperty('--w', werte[i].toFixed(0))
      b.style.setProperty('--d', (90 + (werte[i] - 200) / 700 * 22).toFixed(1))
    })
    tempo *= 0.94
  })

  // Index: die Zeile in der Lesemitte wird laut
  zeilen.forEach((z) => {
    ScrollTrigger.create({ trigger: z, start: 'top 58%', end: 'bottom 42%', toggleClass: 'ist-da' })
  })

  gsap.utils.toArray<HTMLElement>('.raster-aussage p, .feld, .schluss-titel').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
  })
  void klemmen
}
