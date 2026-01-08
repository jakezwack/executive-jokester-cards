
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import SharingCard from '@/components/sharing-card';
import { Button } from '@/components/ui/button';
import { SavedCardData, CardData, Persona } from '@/lib/types';
import { personas } from '@/lib/personas';
import { ArrowLeft, Bomb, Sparkles, Gem } from 'lucide-react';
import CardLoader from '@/components/card-loader';
import { incrementViewCount } from '@/lib/actions';

export default function CardClientPage({ cardId }: { cardId: string }) {
  const firestore = useFirestore();
  const router = useRouter();

  const docRef = useMemoFirebase(() => {
    if (!firestore || typeof cardId !== 'string') return null;
    return doc(firestore, 'sharing_cards', cardId);
  }, [firestore, cardId]);

  const { data: savedCardData, isLoading, error } = useDoc<SavedCardData>(docRef);
  
  const [cardData, setCardData] = useState<CardData | null>(null);

  useEffect(() => {
    if (savedCardData) {
      const persona = personas.find(p => p.id === savedCardData.personaId) || personas[0];
      setCardData({
        name: savedCardData.name,
        persona: persona,
        imageUrl: savedCardData.imageUrl,
        theme: savedCardData.theme,
        satiricalWit: savedCardData.satiricalWit,
        bio: savedCardData.bio,
        isEvolved: savedCardData.isEvolved,
        customQuote: savedCardData.customQuote,
      });
    }
  }, [savedCardData]);

  useEffect(() => {
    if (cardId && typeof cardId === 'string') {
      incrementViewCount(cardId);
    }
  }, [cardId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <CardLoader />
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <div className="text-center p-4">
            <h1 className="text-3xl font-bold text-destructive">Card Not Found</h1>
            <p className="mt-2 text-muted-foreground">This sharing card may have been deleted or the link is incorrect.</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/"><ArrowLeft className="mr-2"/> Back to Generator</Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
         <Button asChild variant="outline">
          <Link href="/"><ArrowLeft className="mr-2"/> Back to Generator</Link>
        </Button>
      </div>
      <div className="flex flex-col items-center gap-8">
        <SharingCard {...cardData} />
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button asChild size="lg" className="w-full bg-primary/90 hover:bg-primary text-primary-foreground animate-pulse">
            <Link href="/">
              <Sparkles className="mr-2"/>
              EVOLVE THIS SOUL
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="secondary" size="lg" className="w-full">
              <Link href={`/?counter=${cardData.persona.id}`}>
                <Bomb className="mr-2"/>
                Retaliate
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
               <Link href="/">
                <Gem className="mr-2"/>
                Coin Your Own
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
