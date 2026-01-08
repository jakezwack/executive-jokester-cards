
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Metadata } from 'next';
import CardClientPage from './card-client-page';
import { SavedCardData } from '@/lib/types';

// Initialize Firebase Admin SDK
let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp();
} else {
  adminApp = getApps()[0];
}

const db = getFirestore(adminApp);

type Props = {
  params: { cardId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cardId = params.cardId;

  try {
    const cardRef = db.collection('sharing_cards').doc(cardId);
    const doc = await cardRef.get();

    if (!doc.exists) {
      return {
        title: 'Card Not Found',
        description: 'This sharing card may have been deleted or the link is incorrect.',
      };
    }

    const cardData = doc.data() as SavedCardData;

    const title = `${cardData.name} - ${cardData.personaName}`;
    const description = `"${cardData.satiricalWit}" | The Executive Jokester`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [
          {
            url: cardData.imageUrl,
            width: 400,
            height: 400,
            alt: cardData.name,
          },
        ],
        siteName: 'The Executive Jokester',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [cardData.imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'The Executive Jokester',
      description: 'Professional satire for the 2026 agentic workplace.',
    };
  }
}

export default function CardPage({ params }: Props) {
  return <CardClientPage cardId={params.cardId} />;
}
