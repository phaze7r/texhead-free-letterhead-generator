import { getSeoSettings } from '@/app/actions/seo'

export async function GET() {
  const settings = await getSeoSettings()
  const robotsTxtWithSitemap = `${settings.robotsTxt}\n\nSitemap: https://letterhead.texodus.tech/sitemap.xml`
  
  return new Response(robotsTxtWithSitemap, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
