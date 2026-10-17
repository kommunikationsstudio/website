# kommunikations.studio – Website

Der öffentliche Auftritt von kommunikations.studio als geführter Essay. Astro, statisch, ohne Cookies und ohne Tracking.

```
npm install
npm run dev      # lokal auf http://localhost:4321
npm run build    # prüft Typen und baut nach dist/
```

- `src/pages/index.astro` – Startseite (Auftakt, Essay, Erstgespräch)
- `src/scripts/schriftfeld.ts` – Punkteschrift im Auftakt
- `src/scripts/essay.ts` – Fokus der sieben Fragen, Schalter „Gewachsen / Geordnet“
- `src/styles/site.css` – Schwarz, Weiß, drei Grautöne; Fraunces und Geist liegen unter `public/fonts`

Bis zur Freigabe ist die Seite mit `noindex` markiert. Freigeben: in Vercel die Umgebungsvariable `PUBLIC_FREIGEGEBEN=true` setzen und neu bauen.
