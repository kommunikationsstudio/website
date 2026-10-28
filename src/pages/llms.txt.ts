import type { APIRoute } from 'astro'

// Kurzbeschreibung für KI-Suchen und Assistenten (llms.txt).
export const GET: APIRoute = ({ site }) => {
  const text = `# kommunikations.studio

> Studio für Positionierung, Erscheinungsbild und Inhalte von Sebastian Knust in Limburg an der Lahn, für kleine und mittlere Unternehmen in Rhein-Main und Mittelhessen. Leitsatz: Wahrnehmung gestalten. Vom Eindruck zur Wirkung.

kommunikations.studio übersetzt Briefing-Floskeln wie „moderner“ oder „hochwertiger“ mit einer eigenen Wahrnehmungsanalyse in konkrete Entscheidungen über sieben Kategorien: Typografie, Bildsprache, Bewegung, Tonalität, Dramaturgie, Atmosphäre und Rhythmus.

## Leistungen

- Positionierung: Wahrnehmungsanalyse, Markenkern und Leitsatz, Sprachleitfaden
- Erscheinungsbild: Corporate Design, Logo und Zeichensystem, Webdesign und Entwicklung
- Inhalte: Foto, Film und Text (Content-Produktion), Employer Branding, interne Kommunikation

## Ablauf

1. Erstgespräch: kostenfrei, per Video oder vor Ort, mit drei konkreten Beobachtungen
2. Wahrnehmungsanalyse in sieben Kategorien, schriftlich
3. Gestaltung und Umsetzung, Entwurf und Code aus einer Hand
4. Übergabe aller Dateien mit Leitfaden

## Person

Sebastian Knust kommt aus der internationalen Luxushotellerie (unter anderem Kempinski, Villa Rothschild, Steigenberger Frankfurter Hof), hat bei Sellwerk Marketinganalysen für kleine und mittlere Unternehmen erstellt und arbeitet seit 2024 in der internen Kommunikation im öffentlichen Sektor.

## Kontakt

- Erstgespräch: kostenfrei, per Video (45 Minuten) oder als Besuch vor Ort in Rhein-Main und Mittelhessen
- E-Mail: kontakt@kommunikations.studio
- Telefon: +49 156 78540600
- Adresse: Felizitas-Massenkeil-Str. 9, 65549 Limburg an der Lahn
- Website: ${site}
- [Impressum](${new URL('/impressum/', site)})
- [Datenschutz](${new URL('/datenschutz/', site)})
- [Sitemap](${new URL('/sitemap.xml', site)})
`
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
