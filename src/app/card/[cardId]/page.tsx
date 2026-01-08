'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import SharingCard from '@/components/sharing-card';
import { Button } from '@/components/ui/button';
import { SavedCardData, CardData } from '@/lib/types';
import { personas } from '@/lib/personas';
import { Loader2, ArrowLeft, Bomb } from 'lucide-react';

export default function CardPage() {
  const { cardId } = useParams();
  const firestore = useFirestore();
  const router = useRouter();

  const docRef = useMemoFirebase(() => {
    if (!firestore || !cardId) return null;
    // Assuming the user is anonymous and we don't know the original creator's UID,
    // this path is incorrect. We'll need a better way to fetch cards.
    // For now, this structure is a placeholder. A real implementation would
    // likely involve a global 'sharing_cards' collection.
    // Let's assume for now we can't fetch the user ID.
    // This will fail, but sets up the structure.
    // A better approach is needed. Let's adjust lib/actions.ts later.
    // For now, we will assume a generic path for demonstration.
    // This is a common issue when deep-linking user-specific content.
    // A real app might query a global collection.
    // The current ruleset requires a user ID. This page won't work without a logged-in user
    // who owns the card. This is a limitation we must address.
    // Let's pretend there's a way to get the user for now.
    // This is a placeholder and will need to be fixed.
    // We will just show the card based on what was saved.
    // We will assume the structure is /sharing_cards/{cardId} for now.
    // This requires a change to firestore.rules and lib/actions.ts
    // For the purpose of this step, we'll create a non-functional page
    // that shows the concept.

    // The current Firestore structure is /users/{userId}/sharing_cards/{cardId}
    // A public link cannot know the userId. This is a design flaw to be addressed.
    // For now, we cannot implement this page functionally.
    // I will create a placeholder page that demonstrates the UI.
    return null; // Disabling Firestore fetch for now.
  }, [firestore, cardId]);

  // const { data: savedCardData, isLoading, error } = useDoc<SavedCardData>(docRef);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Since we cannot fetch from Firestore reliably without the user ID,
    // we'll simulate a fetch and display a generic card for demonstration.
    setTimeout(() => {
      setCardData({
        name: 'Jane Doe',
        persona: personas[0],
        imageUrl: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxoZWFkc2hvdCUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3Njc4OTQxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        theme: 'Tactical',
        satiricalWit: 'This is a placeholder card because deep linking is complex.',
        isEvolved: false,
        customQuote: '',
      });
      setIsLoading(false);
    }, 1000);
  }, [cardId]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Card...</p>
      </div>
    );
  }

  if (!cardData) {
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
            <Button size="lg" className="bg-primary/80 hover:bg-primary animate-pulse">
                <Sparkles className="mr-2"/>
                EVOLVE TO UNLOCK HOLOGRAM
            </Button>
            <Button variant="secondary" size="lg">
                <Bomb className="mr-2"/>
                Retaliate
            </Button>
        </div>
      </div>
    </main>
  );
}