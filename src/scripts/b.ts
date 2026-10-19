// Variante Belichtung: Entwickeln beim Scrollen, Zeilen aus der Maske, Filmstreifen.
import { kern, gsap, ScrollTrigger, klemmen, weich } from './kern'

export function start() {
  const { ruhig } = kern()
  if (ruhig) return

  // Das Bild entwickelt sich: zuerst ein Hauch, mit dem Scrollen volle Belichtung
  const abzug = document.querySelector<HTMLImageElement>('[data-abzug] img')!
  const belichten = (b: number, k: number, z: number) => {
    abzug.style.filter = `grayscale(1) contrast(${k}) brightness(${b})`
    abzug.style.transform = `scale(${z})`
  }
  const zustand = { b: 0, k: 1.4, z: 1.18 }
  gsap.to(zustand, { b: 0.28, duration: 2.6, ease: 'expo.out', onUpdate: () => belichten(zustand.b, zustand.k, zustand.z) })
  ScrollTrigger.create({
    trigger: '[data-dunkelkammer]', start: 'top top', end: '55% top', scrub: true,
    onUpdate: (s) => {
      const e = weich(s.progress)
      zustand.b = 0.28 + 0.62 * e
      zustand.k = 1.4 - 0.25 * e
      zustand.z = 1.18 - 0.18 * e
      belichten(zustand.b, zustand.k, zustand.z)
    },
  })
  gsap.from('[data-belichtet] span', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', stagger: 0.14, delay: 0.2 })
  gsap.from('[data-unter]', { opacity: 0, duration: 1.4, ease: 'expo.out', delay: 1 })
  gsap.to('[data-belichtet]', {
    yPercent: -30, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-dunkelkammer]', start: '45% top', end: '95% top', scrub: true },
  })

  // Zeilen steigen aus einer Maske
  document.querySelectorAll<HTMLElement>('[data-zeilen]').forEach((el) => {
    const woerter = el.textContent!.trim().split(/\s+/)
    el.textContent = ''
    const spans = woerter.map((w) => { const s = document.createElement('span'); s.textContent = w + ' '; s.style.display = 'inline-block'; s.style.whiteSpace = 'pre'; el.append(s); return s })
    // Wörter nach Zeilen gruppieren
    const zeilen: HTMLElement[][] = []
    let oben = -1
    spans.forEach((s) => { if (s.offsetTop !== oben) { zeilen.push([]); oben = s.offsetTop } zeilen[zeilen.length - 1].push(s) })
    el.textContent = ''
    const innen = zeilen.map((z) => {
      const maske = document.createElement('span'); maske.className = 'zeile-maske'
      const i = document.createElement('span'); i.textContent = z.map((s) => s.textContent).join('').trimEnd()
      maske.append(i); el.append(maske); return i
    })
    gsap.from(innen, { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 78%' } })
  })

  // Filmstreifen: waagrecht durch die sieben Bilder, jedes Bild wird belichtet
  const box = document.querySelector<HTMLElement>('[data-achsen]')!
  const stapel = box.querySelector<HTMLElement>('.achsen-stapel')!
  const bilder = [...box.querySelectorAll<HTMLElement>('[data-achse]')]
  const weg = () => stapel.scrollWidth - window.innerWidth
  ScrollTrigger.create({
    trigger: box, start: 'top top', end: () => `+=${weg() * 1.1}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, refreshPriority: 1,
    onUpdate: (s) => {
      stapel.style.transform = `translateX(${-weg() * s.progress}px)`
      const mitte = window.innerWidth / 2
      bilder.forEach((b) => {
        const r = b.getBoundingClientRect()
        const abstand = Math.abs(r.left + r.width / 2 - mitte) / (r.width * 0.9)
        b.style.setProperty('--dunkel', String(klemmen(abstand, 0, 1) * 0.85))
      })
    },
  })
  bilder.forEach((b) => b.style.setProperty('--dunkel', '0.85'))
  ScrollTrigger.sort()
  ScrollTrigger.refresh()

  // Bildplatte entwickelt sich, sobald sie ins Bild kommt
  const platte = document.querySelector<HTMLImageElement>('[data-platte] img')!
  ScrollTrigger.create({
    trigger: '[data-platte]', start: 'top 85%', end: 'center 50%', scrub: true,
    onUpdate: (s) => { const e = weich(s.progress); platte.style.filter = `grayscale(1) contrast(${1.4 - 0.25 * e}) brightness(${e * 0.95})` },
  })

  gsap.utils.toArray<HTMLElement>('.feld, .schluss-titel, .person-eins').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 60, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
  })
}
