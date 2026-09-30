import { MetadataRoute } from 'next'
import { getSupabaseAdmin } from '@/utils/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prevu.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subjects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/requests`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  try {
    const supabase = getSupabaseAdmin()

    // Fetch approved papers for dynamic URLs
    const { data: papers } = await supabase
      .from('papers')
      .select('id, updated_at, created_at')
      .eq('status', 'approved')
      .limit(500)

    const paperRoutes: MetadataRoute.Sitemap = (papers || []).map((paper) => ({
      url: `${baseUrl}/paper/${paper.id}`,
      lastModified: new Date(paper.updated_at || paper.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...paperRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
    return staticRoutes
  }
}
