import type { APIRoute } from 'astro'
import { ARBEITEN_FERTIG } from '../data/arbeiten'

const SEITEN = ['/', ...(ARBEITEN_FERTIG ? ['/arbeiten/'] : []), '/impressum/', '/datenschutz/']

export const GET: APIRoute = ({ site }) => {
  const urls = SEITEN.map((p) => `  <url><loc>${new URL(p, site)}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
