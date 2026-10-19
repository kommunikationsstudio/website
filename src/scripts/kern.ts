// Gemeinsamer Unterbau aller Varianten: weiches Scrollen, Tonwechsel,
// Dekodierer, Leistungen, Portrait und Sprungziele mit Fokus.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { KATEGORIEN } from '../data/inhalt'
import { WOERTER } from '../data/woerter'
import { dekodierer } from './dekodierer'

gsap.registerPlugin(ScrollTrigger)

export const klemmen = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const weich = (t: number) => t * t * (3 - 2 * t)
export { gsap, ScrollTrigger }

export interface Kern { ruhig: boolean; lenis: Lenis | null }

export function kern(): Kern {
  const html = document.documentElement
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches
  html.classList.add('js')
  if (!ruhig) html.classList.add('lebt')

  if (document.querySelector('[data-dekodierer]')) dekodierer(KATEGORIEN, WOERTER, ruhig)

  let lenis: Lenis | null = null
  if (!ruhig) {
    lenis = new Lenis({ autoRaf: false, lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis!.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Sprungziele: weich hinscrollen und den Fokus mitnehmen
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const ziel = document.querySelector<HTMLElement>(a.getAttribute('href')!)
      if (!ziel) return
      e.preventDefault()
      if (!ziel.hasAttribute('tabindex')) ziel.setAttribute('tabindex', '-1')
      const fertig = () => ziel.focus({ preventScroll: true })
      if (lenis) lenis.scrollTo(ziel, { offset: -40, onComplete: fertig })
      else { ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' }); fertig() }
      history.replaceState(null, '', a.getAttribute('href'))
    })
  })

  // Ton: jeder Abschnitt bestimmt, ob die Seite schwarz oder weiß ist
  document.querySelectorAll<HTMLElement>('[data-ton]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => { if (s.isActive) html.dataset.ton = el.dataset.ton },
    })
  })

  if (!ruhig) {
    // Leistungen: der Titel gewinnt Gewicht, während er ins Bild kommt
    document.querySelectorAll<HTMLElement>('[data-gewicht]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 95%', end: 'top 45%', scrub: true,
        onUpdate: (s) => { const e = weich(s.progress); el.style.fontVariationSettings = `'wght' ${Math.round(120 + 780 * e)}, 'wdth' ${Math.round(62 + 50 * e)}` },
      })
    })
    gsap.utils.toArray<HTMLElement>('[data-schritt]').forEach((el, i) => {
      gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: 'expo.out', delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } })
    })
  }

  // Schriften verändern Höhen; danach Positionen neu berechnen
  document.fonts.ready.then(() => ScrollTrigger.refresh())
  return { ruhig, lenis }
}
