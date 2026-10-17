/** Die sieben Fragen: Die Frage in der Bildmitte steht scharf, die übrigen treten zurück. */
export function fokusliste(liste: HTMLElement) {
  const eintraege = [...liste.querySelectorAll('li')]
  let rahmen = 0
  const pruefen = () => {
    cancelAnimationFrame(rahmen)
    rahmen = requestAnimationFrame(() => {
      const mitte = innerHeight * 0.5
      let beste: Element | null = null, abstand = innerHeight * 0.35
      for (const li of eintraege) {
        const r = li.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mitte)
        if (d < abstand) { abstand = d; beste = li }
      }
      liste.classList.toggle('fragenFokus', beste !== null)
      eintraege.forEach((li) => li.classList.toggle('scharf', li === beste))
    })
  }
  pruefen()
  addEventListener('scroll', pruefen, { passive: true })
}

/** Gewachsen oder geordnet: Umschalten zeigt, was aus den Teilen eines Auftritts wird. */
export function vorherNachher(figur: HTMLElement) {
  const liste = figur.querySelector('ul')!
  const knoepfe = [...figur.querySelectorAll<HTMLButtonElement>('button')]
  knoepfe.forEach((k) =>
    k.addEventListener('click', () => {
      const geordnet = k.dataset.zustand === 'geordnet'
      liste.classList.toggle('geordnet', geordnet)
      knoepfe.forEach((b) => b.setAttribute('aria-pressed', String(b === k)))
    }),
  )
}
