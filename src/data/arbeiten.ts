// Projekte für /arbeiten/. Nur belegte Angaben eintragen; leere Felder blendet die Seite aus.
// briefing: das Wort aus dem Briefing, entscheidung: was daraus wurde, ergebnis: was sich messbar verändert hat.
export interface Projekt { name: string; branche: string; ort?: string; seit: string; briefing?: string; entscheidung?: string; ergebnis?: string }

// Kundennamen erst eintragen, wenn Sebastian sie für die Veröffentlichung freigegeben hat.
export const PROJEKTE: Projekt[] = []

// Die Seite erscheint in Kopf, Fuß und Sitemap, sobald jedes Projekt eine Entscheidung trägt.
export const ARBEITEN_FERTIG = PROJEKTE.length > 0 && PROJEKTE.every((p) => p.entscheidung)
