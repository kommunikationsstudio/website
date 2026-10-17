import type { APIRoute } from 'astro'

// Bis zur Freigabe bleiben Suchmaschinen draußen; danach alles offen, auch für KI-Suchen.
export const GET: APIRoute = ({ site }) => {
  const freigegeben = import.meta.env.PUBLIC_FREIGEGEBEN === 'true'
  const text = freigegeben
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`
    : 'User-agent: *\nDisallow: /\n'
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
