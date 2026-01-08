
import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://theexecutivejokester.com';

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic pages (sharing cards)
  const cardsSnapshot = await db.collection('sharing_cards').get();
  const cardRoutes = cardsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      url: `${siteUrl}/card/${doc.id}`,
      // Use the card's creation date as lastModified if available
      lastModified: data.createdAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...cardRoutes];
}
