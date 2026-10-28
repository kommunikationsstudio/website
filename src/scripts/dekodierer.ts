// Dekodierer: zeigt Floskeln aus Briefings und ihre Übersetzung.
// Besuchende können ein eigenes Wort eingeben.

import { grobesWort } from './wortfilter'
import { GEGENTEIL } from '../data/woerter'
import * as Z from '../data/zwischenrufe'

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

  const FUELL = /\b(mehr|etwas|viel|noch|sehr|bitte|wir|wollen|möchten|soll|sollen|sein|wirken|und|oder|aber|so|ganz|eher|weniger|zu|nicht|kein|keine|ein|eine|einfach mal)\b/g
  const kandidaten = (w: string) => [w, ...ENDUNGEN.filter((e) => w.endsWith(e) && w.length - e.length >= 3).map((e) => w.slice(0, -e.length))]

  // Abstand zweier Wörter, für Tippfehler wie „serös“ oder „lebendieg“
  function abstand(a: string, b: string) {
    if (Math.abs(a.length - b.length) > 1) return 2
    let vor = Array.from({ length: b.length + 1 }, (_, j) => j)
    for (let x = 1; x <= a.length; x++) {
      const neu = [x]
      for (let y = 1; y <= b.length; y++) neu[y] = Math.min(vor[y] + 1, neu[y - 1] + 1, vor[y - 1] + (a[x - 1] === b[y - 1] ? 0 : 1))
      vor = neu
    }
    return vor[b.length]
  }

  function suchen(liste: Wort[], w: string, unscharf: boolean): Wort | null {
    for (const k of kandidaten(w)) {
      const t = liste.find(([staemme]) => staemme.includes(k))
      if (t) return t
    }
    if (!unscharf || w.length < 5) return null
    for (const k of kandidaten(w)) {
      const t = liste.find(([staemme]) => staemme.some((st) => st.length >= 5 && abstand(k, st) <= 1))
      if (t) return t
    }
    return null
  }

  const woerter = (eingabe: string) => eingabe.toLowerCase().replace(/[^a-zäöüß ]/g, ' ').replace(FUELL, ' ').trim().split(/\s+/).filter(Boolean)

  // Sucht von hinten nach vorn, weil das Adjektiv meist am Ende steht
  function finden(eingabe: string): { t: Wort, gegen: boolean, un?: string } | null {
    const liste = woerter(eingabe).reverse()
    for (const unscharf of [false, true]) {
      for (const w of liste) {
        const g = suchen(GEGENTEIL, w, unscharf)
        if (g) return { t: g, gegen: true }
        const t = suchen(WOERTER, w, unscharf)
        if (t) return { t, gegen: false }
        // „unseriös“: das Gegenteil eines bekannten Worts
        if (w.startsWith('un') && w.length > 5) {
          const u = suchen(WOERTER, w.slice(2), false)
          if (u) return { t: u, gegen: false, un: w }
        }
      }
    }
    return null
  }

  const zufall = <T,>(liste: T[]) => liste[Math.floor(Math.random() * liste.length)]
  let unbekannt = 0

  // Antwort auf Eingaben, die sicher kein Briefing-Wort sind. null heißt: weiter suchen.
  function zwischenruf(roh: string): Z.Antwort | null {
    const klein = roh.toLowerCase().replace(/[.!?,;:]+$/g, '').replace(/\s+/g, ' ').trim()
    if (/^\D*42\D*$/.test(klein)) return Z.ZWEIUNDVIERZIG
    if (/^[\d\s.,+\-–%€$]+$/.test(klein)) return Z.ZAHL
    if (!/\p{L}/u.test(klein)) return Z.ZEICHEN
    if (/^\p{L}$/u.test(klein)) return Z.BUCHSTABE
    for (const [liste, antwort] of Z.BEKANNT) if (liste.includes(klein)) return antwort
    return null
  }

  function salat(roh: string): Z.Antwort | null {
    const nurBuchstaben = roh.toLowerCase().replace(/[^a-zäöüß]/g, '')
    // Tastatursalat: keine Vokale, lange Konsonantenketten oder ein Zeichen in Dauerschleife
    if (nurBuchstaben.length >= 4 && (!/[aeiouyäöü]/.test(nurBuchstaben) || /[^aeiouyäöü]{6,}/.test(nurBuchstaben) || /(.)\1{3,}/.test(nurBuchstaben))) return zufall(Z.SALAT)
    return null
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const roh = feld.value.trim().replace(/^(wir\s+)?(wollen|möchten|brauchen|sollen)\s+/i, '').replace(/\s+(wirken|sein|aussehen|rüberkommen)\W*$/i, '')
    if (!roh) {
      feld.setAttribute('aria-invalid', 'true')
      hinweis.textContent = 'Bitte geben Sie ein Wort ein, zum Beispiel seriöser.'
      feld.focus()
      return
    }
    feld.removeAttribute('aria-invalid')
    hinweis.textContent = ''
    anhalten()

    const grob = grobesWort(roh)
    const vorab = grob ? null : zwischenruf(roh)
    const treffer = grob || vorab ? null : finden(roh)
    let antwortText: Z.Antwort
    if (grob) antwortText = zufall(Z.GROB)
    else if (vorab) antwortText = vorab
    else if (treffer?.un) antwortText = ['Im Gespräch', `Das Gegenteil als Ziel? Ein seltener Wunsch. Im Erstgespräch finden wir heraus, was dahinter steckt.`]
    else if (treffer) antwortText = [treffer.t[1], treffer.t[2]]
    else antwortText = salat(roh) ?? (woerter(roh).length > 4 ? Z.LANG : Z.UNBEKANNT[unbekannt++ % Z.UNBEKANNT.length])

    const kern = roh.replace(/^(mehr|etwas|viel|weniger)\s+/i, '')
    const nomen = /^\p{Lu}/u.test(kern) && !/\s/.test(kern)
    takt(() => {
      // Grobe Wörter erscheinen nie auf der Seite
      if (grob) briefing.replaceChildren('„Wir wollen ', strich('…'), ' wirken.“')
      else if (!treffer) briefing.replaceChildren('„', strich(roh), '“')
      else if (treffer?.gegen && !/^weniger\s/i.test(roh)) briefing.replaceChildren('„Wir wollen weniger ', strich(roh), ' wirken.“')
      else if (nomen) briefing.replaceChildren('„Wir brauchen mehr ', strich(kern), '.“')
      else briefing.replaceChildren('„Wir wollen ', strich(roh), ' wirken.“')
      kat.textContent = antwortText[0]
      antwort.textContent = antwortText[1]
      ansage.textContent = `${kat.textContent}: ${antwort.textContent}`
    })
    if (grob) feld.value = ''
  })
}
