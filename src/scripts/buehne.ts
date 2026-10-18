// Steuert die Startseite: weiches Scrollen, Tonwechsel zwischen Schwarz und Weiß,
// die Schärfe-Bühne, die sieben Achsen und den Dekodierer.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { schaerfe } from './schaerfe'
import { dekodierer } from './dekodierer'

gsap.registerPlugin(ScrollTrigger)

const klemmen = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const weich = (t: number) => t * t * (3 - 2 * t)

export async function start() {
  const html = document.documentElement
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches
  html.classList.add('js')
  if (!ruhig) html.classList.add('lebt')

  const daten = JSON.parse(document.getElementById('daten')!.textContent!)
  dekodierer(daten.KATEGORIEN, daten.WOERTER, ruhig)

  // Weiches Scrollen, an GSAP gekoppelt
  if (!ruhig) {
    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.09 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Ton: jeder Abschnitt bestimmt, ob die Seite schwarz oder weiß ist
  document.querySelectorAll<HTMLElement>('[data-ton]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (s) => { if (s.isActive) html.dataset.ton = el.dataset.ton },
    })
  })

  // Schärfe-Bühne
  await document.fonts.load('900 100px Archivo').catch(() => {})
  const flaeche = document.querySelector<HTMLCanvasElement>('[data-schaerfe]')!
  const titel = document.querySelector<HTMLElement>('[data-titel]')!
  const zeilen = [...titel.querySelectorAll('span')].map((s) => s.textContent!.trim())
  const buehne = schaerfe(flaeche, zeilen, ruhig)
  if (buehne) {
    html.classList.add('gl')
    buehne.setSchaerfe(0.04)
    ScrollTrigger.create({
      trigger: '[data-buehne]',
      start: 'top top',
      end: '50% top',
      scrub: true,
      onUpdate: (s) => buehne.setSchaerfe(0.04 + 0.96 * weich(s.progress)),
    })
  }
  if (!ruhig) {
    gsap.fromTo('[data-unter]', { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: '[data-buehne]', start: '20% top', end: '45% top', scrub: true },
    })
    gsap.to('[data-hinweis]', {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '[data-buehne]', start: 'top top', end: '12% top', scrub: true },
    })

    // Aussage: Wort für Wort vom Eindruck zur Wirkung
    gsap.fromTo('[data-woerter] span', { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: '[data-woerter]', start: 'top 80%', end: 'bottom 45%', scrub: true },
    })

    achsen()

    // Leistungen: der Titel gewinnt Gewicht, während er ins Bild kommt
    document.querySelectorAll<HTMLElement>('[data-gewicht]').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 95%', end: 'top 40%', scrub: true,
        onUpdate: (s) => { el.style.fontVariationSettings = `'wght' ${Math.round(120 + 780 * weich(s.progress))}, 'wdth' ${Math.round(62 + 50 * weich(s.progress))}` },
      })
    })

    // Portrait öffnet sich aus der Mitte
    gsap.fromTo('[data-portrait]', { clipPath: 'inset(22% 18% 22% 18%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: '[data-portrait]', start: 'top 90%', end: 'center 55%', scrub: true },
    })
    gsap.fromTo('[data-portrait] img', { scale: 1.25 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-portrait]', start: 'top bottom', end: 'bottom top', scrub: true },
    })

    magnet()
  }
}

// Sieben Achsen: jedes Wort führt vor, wofür es steht
function achsen() {
  const box = document.querySelector<HTMLElement>('[data-achsen]')!
  const tafeln = [...box.querySelectorAll<HTMLElement>('[data-achse]')]
  const balken = box.querySelector<HTMLElement>('[data-achsen-balken]')!
  const n = tafeln.length
  const teile = tafeln.map((t) => ({
    tafel: t,
    art: t.dataset.art!,
    wort: t.querySelector<HTMLElement>('.achse-wort')!,
    buchstaben: [...t.querySelectorAll<HTMLElement>('.achse-wort span')],
    text: t.querySelector<HTMLElement>('.achse-text')!,
  }))
  let zeit = 0
  let stand = 0

  function zeigen(p: number) {
    stand = p
    const pos = klemmen(p * n, 0, n - 0.0001)
    const aktiv = Math.floor(pos)
    const t = pos - aktiv
    balken.style.transform = `scaleX(${p})`
    teile.forEach((teil, i) => {
      const da = i === aktiv
      teil.tafel.style.visibility = da ? 'visible' : 'hidden'
      if (!da) return
      const ein = i === 0 ? 1 : klemmen(t / 0.12)
      const aus = i === n - 1 ? 1 : klemmen((1 - t) / 0.12)
      teil.tafel.style.opacity = String(Math.min(ein, aus))
      const e = weich(klemmen((t - 0.08) / 0.62))
      teil.text.style.opacity = String(klemmen((t - 0.3) / 0.2))
      teil.text.style.transform = `translateY(${(1 - klemmen((t - 0.3) / 0.2)) * 24}px)`
      vorfuehren(teil, e)
    })
  }

  function vorfuehren(teil: (typeof teile)[number], e: number) {
    const { art, wort, buchstaben } = teil
    const anzahl = buchstaben.length
    switch (art) {
      case 'typografie':
        wort.style.fontVariationSettings = `'wght' ${100 + 800 * e}, 'wdth' ${62 + 56 * e}`
        break
      case 'bildsprache':
        // Vom Gesicht ganz nah bis zur ganzen Person
        wort.style.backgroundPosition = `50% ${18 + 22 * e}%`
        wort.style.backgroundSize = `${340 - 240 * e}% auto`
        break
      case 'bewegung':
        buchstaben.forEach((b, i) => {
          const unruhe = (1 - e) * 0.32
          const y = Math.sin(i * 1.7 + zeit * 3.1) * unruhe + Math.sin(i * 0.9 - zeit * 1.3) * unruhe * 0.6
          const r = Math.sin(i * 2.3 + zeit * 2) * (1 - e) * 14
          b.style.transform = `translateY(${y}em) rotate(${r}deg)`
        })
        break
      case 'tonalitaet':
        wort.style.fontVariationSettings = `'wght' ${900 - 520 * e}, 'wdth' ${125 - 25 * e}`
        buchstaben.forEach((b) => {
          const z = (1 - e) * 0.05
          b.style.transform = `translate(${(Math.random() - 0.5) * z}em, ${(Math.random() - 0.5) * z}em)`
        })
        break
      case 'dramaturgie':
        buchstaben.forEach((b, i) => {
          const s = klemmen(e * (anzahl + 2) - i)
          b.style.opacity = String(0.08 + 0.92 * s)
          b.style.transform = `translateY(${(1 - weich(s)) * 0.3}em)`
        })
        break
      case 'atmosphaere':
        wort.style.filter = `blur(${(1 - e) * 26}px)`
        wort.style.letterSpacing = `${0.18 * (1 - e) - 0.02}em`
        wort.style.opacity = String(0.25 + 0.75 * e)
        break
      case 'rhythmus':
        buchstaben.forEach((b, i) => {
          const pause = i === 2 || i === 5 ? 0.42 : 0
          b.style.marginRight = `${pause * e}em`
          b.style.transform = `translateY(${Math.sin(zeit * 4 + i * 0.8) * 0.03 * (1 - e)}em)`
        })
        break
    }
  }

  ScrollTrigger.create({
    trigger: box,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (s) => zeigen(s.progress),
  })
  zeigen(0)

  // Bewegung und Rhythmus brauchen auch ohne Scrollen einen Takt
  gsap.ticker.add((t) => {
    zeit = t
    const pos = klemmen(stand * n, 0, n - 0.0001)
    const art = teile[Math.floor(pos)].art
    if (art === 'bewegung' || art === 'rhythmus' || art === 'tonalitaet') zeigen(stand)
  })
}

// Der Knopf folgt dem Zeiger ein Stück, wenn er in der Nähe ist
function magnet() {
  if (!matchMedia('(pointer: fine)').matches) return
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * 0.35)
      y((e.clientY - r.top - r.height / 2) * 0.35)
    })
    el.addEventListener('pointerleave', () => { x(0); y(0) })
  })
}
