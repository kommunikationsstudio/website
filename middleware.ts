import { next, rewrite } from '@vercel/functions'

// Läuft in Vercels Middleware-Umgebung; Node-Typen braucht die Website sonst nicht.
declare const process: { env: Record<string, string | undefined> }

// Sperre bis zur Freigabe (Sebastian, 03.11.2026): Er sichtet die Seite und
// stellt seine Referenzarbeiten ein. Bis dahin sehen Besucher die 3D-Vorschau
// unter /vorschau/. Sebastian tritt über /zugang/ mit dem Passwort ein, das er
// selbst in Vercel als SEITE_PASSWORT einträgt; fehlt es, bleibt die Tür zu.
//
// Frei bleiben alle Pfade, die vercel.json ins Office weiterleitet. Sonst
// landeten Kund*innen mit einem alten Upload-Link auf der Vorschau.
export const config = {
  matcher: [
    '/((?!(?:m|upload)/|(?:dashboard|sign-in|kein-zugang|api|atelier|labor|match-o-meter|preview|neu|VBoL|pubrechner|hotelb4|pwa)(?:/|$)|(?:sw\\.js|dashboard-manifest\\.webmanifest|kes-manifest\\.webmanifest)$).*)',
  ],
}

const COOKIE = 'ks_zugang'

// Ohne Passwort erreichbar: die Vorschau selbst, der Eingang, Impressum und
// Datenschutz (Pflicht für jede öffentliche Seite) und alle Dateien mit
// Endung, die die Vorschau zum Laufen braucht. llms.txt beschreibt den Inhalt
// der ganzen Website und bleibt deshalb gesperrt.
const OFFEN = /^\/(?:vorschau|zugang|impressum|datenschutz)\/?$/
function istDatei(pfad: string) {
  return /\.[a-z0-9]+$/i.test(pfad) && !/\.html$/i.test(pfad) && pfad !== '/llms.txt' && pfad !== '/sitemap.xml'
}

async function marke(passwort: string): Promise<string> {
  const roh = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`ks-zugang:${passwort}`))
  return Array.from(new Uint8Array(roh), (b) => b.toString(16).padStart(2, '0')).join('')
}

function gleich(a: string, b: string): boolean {
  // Vergleich ohne frühen Abbruch, damit die Antwortzeit nichts verrät.
  let unterschied = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    unterschied |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return unterschied === 0
}

function cookieAus(anfrage: Request): string {
  const zeile = anfrage.headers.get('cookie') ?? ''
  const treffer = zeile.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))
  return treffer ? treffer.slice(COOKIE.length + 1) : ''
}

const weiter = (ziel: string, cookie?: string) => {
  const kopf = new Headers({ Location: ziel, 'Cache-Control': 'no-store' })
  if (cookie) kopf.append('Set-Cookie', cookie)
  return new Response(null, { status: 303, headers: kopf })
}

export default async function middleware(anfrage: Request) {
  if (process.env.PUBLIC_FREIGEGEBEN === 'true') return next()

  const url = new URL(anfrage.url)
  const soll = process.env.SEITE_PASSWORT ?? ''

  if (url.pathname.replace(/\/$/, '') === '/zugang' && anfrage.method === 'POST') {
    const form = await anfrage.formData().catch(() => null)
    const ist = String(form?.get('passwort') ?? '')
    if (soll && gleich(ist, soll)) {
      const wert = await marke(soll)
      return weiter('/', `${COOKIE}=${wert}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`)
    }
    return weiter('/zugang/?falsch')
  }

  if (soll && gleich(cookieAus(anfrage), await marke(soll))) return next()
  if (OFFEN.test(url.pathname) || istDatei(url.pathname)) return next()

  return rewrite(new URL('/vorschau/', url), {
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}
