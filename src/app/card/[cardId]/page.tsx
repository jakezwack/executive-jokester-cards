
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import SharingCard from '@/components/sharing-card';
import { Button } from '@/components/ui/button';
import { SavedCardData, CardData, Persona } from '@/lib/types';
import { personas } from '@/lib/personas';
import { Loader2, ArrowLeft, Bomb, Sparkles } from 'lucide-react';

export default function CardPage() {
  const { cardId } = useParams();
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Card...</p>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <h1 className="text-3xl font-bold text-destructive">Card Not Found</h1>
        <p className="mt-2 text-muted-foreground">This sharing card may have been deleted or the link is incorrect.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/"><ArrowLeft /> Back to Generator</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
         <Button asChild variant="outline">
          <Link href="/"><ArrowLeft /> Back to Generator</Link>
        </Button>
      </div>
      <div className="flex flex-col items-center gap-8">
        <SharingCard {...cardData} />
        <div className="flex gap-4">
            <Button asChild size="lg" className="bg-primary/80 hover:bg-primary animate-pulse">
                <Link href="/">
                    <Sparkles className="mr-2"/>
                    EVOLVE TO UNLOCK HOLOGRAM
                </Link>
            </Button>
            <Button variant="secondary" size="lg" onClick={() => router.push('/')}>
                <Bomb className="mr-2"/>
                Retaliate
            </Button>
        </div>
      </div>
    </main>
  );
}
