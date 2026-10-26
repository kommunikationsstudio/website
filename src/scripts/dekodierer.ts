// Dekodierer: zeigt Floskeln aus Briefings und ihre Übersetzung.
// Besuchende können ein eigenes Wort eingeben.

interface Kategorie { kat: string; vor: string; wort: string; nach: string; antwort: string }
type Wort = [string[], string, string]

const ENDUNGEN = ['eren', 'erer', 'eres', 'erem', 'ere', 'er', 'en', 'es', 'em', 'e']

export function dekodierer(KATEGORIEN: Kategorie[], WOERTER: Wort[], ruhig: boolean) {
  const box = document.querySelector<HTMLElement>('[data-dekodierer]')!
  const briefing = box.querySelector<HTMLElement>('[data-briefing]')!
  const antwort = box.querySelector<HTMLElement>('[data-antwort]')!
  const kat = box.querySelector<HTMLElement>('[data-kat]')!
  const form = box.querySelector<HTMLFormElement>('[data-eigenes]')!
  const feld = form.querySelector<HTMLInputElement>('input')!
  const hinweis = form.querySelector<HTMLElement>('[data-hinweis-feld]')!
  const ansage = box.querySelector<HTMLElement>('[data-ansage]')!
  let i = 0, uhr = 0, sichtbar = false, angehalten = false, runden = 0
  box.classList.add('durch', 'da')

  // Wer liest oder tippt, behält das aktuelle Beispiel
  const anhalten = () => { angehalten = true; clearTimeout(uhr); box.classList.add('durch', 'da') }
  box.addEventListener('focusin', anhalten)
  box.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') anhalten() })

  const strich = (text: string) => Object.assign(document.createElement('s'), { textContent: text })

  // Ein Takt: Briefing steht, das Wort wird durchgestrichen, die Übersetzung erscheint
  function takt(setzen: () => void, danach?: () => void) {
    clearTimeout(uhr)
    if (ruhig) { setzen(); box.classList.add('durch', 'da'); return }
    box.classList.remove('da', 'durch')
    uhr = window.setTimeout(() => {
      setzen()
      uhr = window.setTimeout(() => {
        box.classList.add('durch')
        uhr = window.setTimeout(() => {
          box.classList.add('da')
          if (danach) uhr = window.setTimeout(danach, 4200)
        }, 700)
      }, 900)
    }, 450)
  }

  function weiter() {
    if (angehalten || !sichtbar) return
    i = (i + 1) % KATEGORIEN.length
    // Nach einer vollen Runde bleibt das erste Beispiel stehen
    if (i === 0 && ++runden >= 1) angehalten = true
    const k = KATEGORIEN[i]
    takt(() => {
      briefing.replaceChildren(k.vor, strich(k.wort), k.nach)
      antwort.textContent = k.antwort
      kat.textContent = k.kat
    }, weiter)
  }

  new IntersectionObserver(([e]) => {
    const vorher = sichtbar
    sichtbar = e.isIntersecting
    if (sichtbar && !vorher && !angehalten && !ruhig) { clearTimeout(uhr); uhr = window.setTimeout(weiter, 2600) }
    if (!sichtbar) clearTimeout(uhr)
  }, { threshold: 0.4 }).observe(box)

  function finden(eingabe: string): Wort | null {
    const w = eingabe.toLowerCase().replace(/[^a-zäöüß ]/g, ' ').replace(/\b(mehr|etwas|viel|noch|sehr|bitte|wir|wollen|soll|sein|wirken)\b/g, ' ').trim().split(/\s+/).pop() || ''
    const kandidaten = [w, ...ENDUNGEN.filter((e) => w.endsWith(e) && w.length - e.length >= 3).map((e) => w.slice(0, -e.length))]
    for (const k of kandidaten) {
      const treffer = WOERTER.find(([staemme]) => staemme.includes(k))
      if (treffer) return treffer
    }
    return null
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const roh = feld.value.trim()
    if (!roh) {
      feld.setAttribute('aria-invalid', 'true')
      hinweis.textContent = 'Bitte geben Sie ein Wort ein, zum Beispiel seriöser.'
      feld.focus()
      return
    }
    feld.removeAttribute('aria-invalid')
    hinweis.textContent = ''
    anhalten()
    const treffer = finden(roh)
    const kern = roh.replace(/^(mehr|etwas|viel)\s+/i, '')
    const nomen = /^\p{Lu}/u.test(kern)
    takt(() => {
      if (nomen) briefing.replaceChildren('„Wir brauchen mehr ', strich(kern), '.“')
      else briefing.replaceChildren('„Wir wollen ', strich(roh), ' wirken.“')
      kat.textContent = treffer ? treffer[1] : 'Im Gespräch'
      antwort.textContent = treffer ? treffer[2] : 'Dieses Wort fehlt noch in meiner Liste. Bringen Sie es ins Erstgespräch mit.'
      ansage.textContent = `${kat.textContent}: ${antwort.textContent}`
    })
  })
}
