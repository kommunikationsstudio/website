// Startseite: WebGL-Bühne, Wort-für-Wort-Aussage, sieben Achsen als Scroll-Bühne.
import { kern, gsap, ScrollTrigger, klemmen, weich } from './kern'
import { schaerfe } from './schaerfe'

export async function start() {
  const { ruhig } = kern()
  const html = document.documentElement

  await document.fonts.load('900 100px Archivo').catch(() => {})
  const flaeche = document.querySelector<HTMLCanvasElement>('[data-schaerfe]')!
  const buehne = schaerfe(flaeche, ['wahrnehmung', 'gestalten.'], ['wahr-', 'nehmung', 'gestal-', 'ten.'], ruhig, () => html.classList.remove('gl'))
  if (buehne) {
    html.classList.add('gl')
    const grob = matchMedia('(pointer: coarse)').matches
    const basis = grob ? 0.22 : 0.04
    buehne.setSchaerfe(basis)
    ScrollTrigger.create({
      trigger: '[data-buehne]', start: 'top top', end: '45% top', scrub: true,
      onUpdate: (s) => buehne.setSchaerfe(basis + (1 - basis) * weich(s.progress)),
    })
  }
  if (ruhig) return

  gsap.fromTo('[data-unter]', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-buehne]', start: '18% top', end: '40% top', scrub: true },
  })
  gsap.to('[data-buehne-innen]', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-buehne]', start: '72% top', end: '100% top', scrub: true },
  })

  // Aussage: Wort für Wort vom Eindruck zur Wirkung
  gsap.fromTo('[data-woerter] span', { opacity: 0.4 }, {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '[data-woerter]', start: 'top 80%', end: 'bottom 50%', scrub: true },
  })

  achsen()

  gsap.fromTo('[data-portrait]', { clipPath: 'inset(16% 14% 16% 14%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: '[data-portrait]', start: 'top 90%', end: 'center 60%', scrub: true },
  })
}

// Sieben Achsen: jedes Wort führt vor, wofür es steht
function achsen() {
  const box = document.querySelector<HTMLElement>('[data-achsen]')!
  const balken = box.querySelector<HTMLElement>('[data-achsen-balken]')!
  const teile = [...box.querySelectorAll<HTMLElement>('[data-achse]')].map((t) => ({
    tafel: t,
    art: t.dataset.art!,
    wort: t.querySelector<HTMLElement>('.achse-wort')!,
    buchstaben: [...t.querySelectorAll<HTMLElement>('.achse-wort .b')],
    text: t.querySelector<HTMLElement>('.achse-text')!,
    bild: t.querySelector<HTMLElement>('.achse-bild'),
  }))
  const n = teile.length
  let zeit = 0, stand = 0, aktivAbschnitt = false

  function zeigen(p: number) {
    stand = p
    const pos = klemmen(p * n, 0, n - 0.0001)
    const aktiv = Math.floor(pos)
    const t = pos - aktiv
    balken.style.transform = `scaleX(${p})`
    teile.forEach((teil, i) => {
      const da = i === aktiv
      teil.tafel.classList.toggle('ist-da', da)
      if (!da) { teil.tafel.style.opacity = '0'; return }
      const ein = i === 0 ? 1 : klemmen(t / 0.12)
      const aus = i === n - 1 ? 1 : klemmen((1 - t) / 0.12)
      teil.tafel.style.opacity = String(Math.min(ein, aus))
      const e = weich(klemmen((t - 0.06) / 0.6))
      const tx = klemmen((t - 0.25) / 0.2)
      teil.text.style.opacity = String(tx)
      teil.text.style.transform = `translateY(${(1 - tx) * 24}px)`
      vorfuehren(teil, e)
    })
  }

  function vorfuehren(teil: (typeof teile)[number], e: number) {
    const { art, wort, buchstaben, bild } = teil
    const anzahl = buchstaben.length
    switch (art) {
      case 'typografie':
        wort.style.fontVariationSettings = `'wght' ${100 + 800 * e}, 'wdth' ${62 + 56 * e}`
        break
      case 'bildsprache':
        // Ein Schlitz öffnet sich auf ein echtes Bild, von ganz nah zur Person
        if (bild) {
          bild.style.clipPath = `inset(${50 - 50 * e}% 0 ${50 - 50 * e}% 0)`
          bild.querySelector('img')!.style.transform = `scale(${1.6 - 0.6 * e})`
        }
        break
      case 'bewegung':
        buchstaben.forEach((b, i) => {
          const unruhe = (1 - e) * 0.32
          const y = Math.sin(i * 1.7 + zeit * 3.1) * unruhe + Math.sin(i * 0.9 - zeit * 1.3) * unruhe * 0.6
          b.style.transform = `translateY(${y}em) rotate(${Math.sin(i * 2.3 + zeit * 2) * (1 - e) * 14}deg)`
        })
        break
      case 'tonalitaet':
        wort.style.fontVariationSettings = `'wght' ${900 - 520 * e}, 'wdth' ${118 - 18 * e}`
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
          b.style.marginRight = `${(i === 2 || i === 5 ? 0.42 : 0) * e}em`
          b.style.transform = `translateY(${Math.sin(zeit * 4 + i * 0.8) * 0.03 * (1 - e)}em)`
        })
        break
    }
  }

  ScrollTrigger.create({
    trigger: box, start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => zeigen(s.progress),
    onToggle: (s) => { aktivAbschnitt = s.isActive },
  })
  zeigen(0)

  // Bewegte Arten brauchen auch ohne Scrollen einen Takt, aber nur im Bild
  gsap.ticker.add((t) => {
    if (!aktivAbschnitt) return
    zeit = t
    const art = teile[Math.floor(klemmen(stand * n, 0, n - 0.0001))].art
    if (art === 'bewegung' || art === 'rhythmus' || art === 'tonalitaet') zeigen(stand)
  })
}
