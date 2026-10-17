import type { APIRoute } from 'astro'

// Kurzbeschreibung für KI-Suchen und Assistenten (llms.txt).
export const GET: APIRoute = ({ site }) => {
  const text = `# kommunikations.studio

> Studio für Positionierung, Erscheinungsbild und Inhalte von Sebastian Knust in Limburg an der Lahn, tätig in Rhein-Main und Mittelhessen. Leitsatz: Wahrnehmung gestalten. Vom Eindruck zur Wirkung.

kommunikations.studio übersetzt vage Briefing-Wünsche wie „moderner“ oder „hochwertiger“ mit einer eigenen Wahrnehmungsanalyse in konkrete Entscheidungen über sieben Kategorien: Typografie, Bildsprache, Bewegung, Tonalität, Dramaturgie, Atmosphäre und Rhythmus.

## Leistungen

- Positionierung: Wahrnehmungsanalyse, Positionierung und Markenkern, Sprachleitfaden
- Erscheinungsbild: Corporate Design, Logo und Zeichensystem, Webdesign und Entwicklung
- Inhalte: Content-Produktion, Employer Branding, interne Kommunikation

## Person

Sebastian Knust kommt aus der internationalen Luxushotellerie (unter anderem Kempinski, Villa Rothschild, Steigenberger Frankfurter Hof) und arbeitet seit 2024 in der internen Kommunikation im öffentlichen Sektor.

## Kontakt

- Erstgespräch: kostenfrei, 45 Minuten
- E-Mail: kontakt@kommunikations.studio
- Website: ${site}
- [Impressum](${new URL('/impressum', site)})
`
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
