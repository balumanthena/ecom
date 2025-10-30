import { MetadataRoute } from 'next'

// NOTE: For true dynamic products you’d read from Firestore on the server.
// On free tier without Admin SDK, you can keep a static list or skip dynamic items.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/shop`, lastModified: new Date() },
    { url: `${base}/account`, lastModified: new Date() },
  ]
}
