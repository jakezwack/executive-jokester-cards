
import { Metadata } from 'next';
import CardClientPage from './card-client-page';
import { SavedCardData } from '@/lib/types';
import { db } from '@/lib/firebase-admin';


type Props = {
  params: { cardId: string }
}

export async function getCardData(cardId: string): Promise<SavedCardData | null> {
  try {
    const cardRef = db.collection('sharing_cards').doc(cardId);
    const doc = await cardRef.get();
    if (!doc.exists) {
      return null;
    }
    // Note: Firestore Admin SDK returns a different shape for Timestamps
    const data = doc.data();
    if (!data) return null;

    return {
      id: doc.id,
      name: data.name || '',
      personaId: data.personaId || '',
      personaName: data.personaName || '',
      imageUrl: data.imageUrl || '',
      theme: data.theme || 'Tactical',
      satiricalWit: data.satiricalWit || '',
      isEvolved: data.isEvolved || false,
      userProfileId: data.userProfileId || '',
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      shareCount: data.shareCount || 0,
      engagementScore: data.engagementScore || 0,
      lastSharedBy: data.lastSharedBy || '',
      viewCount: data.viewCount || 0,
      submissionStatus: data.submissionStatus || 'none',
      bio: data.bio || '',
      customQuote: data.customQuote || '',
      inspirationalStory: data.inspirationalStory || '',
    } as SavedCardData;

  } catch (error) {
    console.error('Error fetching card data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cardId = params.cardId;
  const cardData = await getCardData(cardId);

  const siteUrl = 'https://theexecutivejokester.com';
  const cardUrl = `${siteUrl}/card/${cardId}`;

  if (!cardData) {
    return {
      title: 'Card Not Found',
      description: 'This sharing card may have been deleted or the link is incorrect.',
      metadataBase: new URL(siteUrl),
    };
  }

  const title = `${cardData.name} - ${cardData.personaName}`;
  const description = `"${cardData.satiricalWit}" | The Executive Jokester`;
  
  return {
    title: title,
    description: description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: title,
      description: description,
      url: cardUrl,
      siteName: 'The Executive Jokester',
      type: 'website',
      // The images array is implicitly handled by opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      creator: '@execjokester',
      // The images array is implicitly handled by opengraph-image.tsx
    },
  };
}

export default async function CardPage({ params }: Props) {
  const initialCardData = await getCardData(params.cardId);
  return <CardClientPage cardId={params.cardId} initialCardData={initialCardData} />;
}
