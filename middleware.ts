import { next } from '@vercel/functions'

// Läuft in Vercels Middleware-Umgebung; Node-Typen braucht die Website sonst nicht.
declare const process: { env: Record<string, string | undefined> }

// Sperre bis zur Freigabe: Sebastian sichtet die Seite erst vollständig und
// stellt seine Referenzarbeiten ein (03.11.2026). Bis dahin fragt der Browser
// nach einem Passwort. Den Wert trägt Sebastian selbst in Vercel als
// SEITE_PASSWORT ein; fehlt er, bleibt die Tür zu.
//
// Frei bleiben alle Pfade, die vercel.json ins Office weiterleitet. Sonst
// stünden Kund*innen mit einem alten Upload-Link vor dem Passwort.
export const config = {
  matcher: [
    '/((?!(?:m|upload)/|(?:dashboard|sign-in|kein-zugang|api|atelier|labor|match-o-meter|preview|neu|VBoL|pubrechner|hotelb4|pwa)(?:/|$)|(?:sw\\.js|dashboard-manifest\\.webmanifest|kes-manifest\\.webmanifest)$).*)',
  ],
}

function gleich(a: string, b: string): boolean {
  // Vergleich ohne frühen Abbruch, damit die Antwortzeit nichts verrät.
  let unterschied = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    unterschied |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return unterschied === 0
}

function passwortAus(anfrage: Request): string | null {
  const kopf = anfrage.headers.get('authorization') ?? ''
  if (!kopf.startsWith('Basic ')) return null
  try {
    const klar = atob(kopf.slice(6))
    // Der Name davor ist egal, es zählt nur das Passwort.
    return klar.slice(klar.indexOf(':') + 1)
  } catch {
    return null
  }
}

export default function middleware(anfrage: Request) {
  if (process.env.PUBLIC_FREIGEGEBEN === 'true') return next()

  const soll = process.env.SEITE_PASSWORT ?? ''
  const ist = passwortAus(anfrage)
  if (soll && ist !== null && gleich(ist, soll)) return next()

  return new Response('Diese Seite ist noch nicht freigegeben.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="kommunikations.studio", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
