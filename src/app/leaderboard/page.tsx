
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import { SavedCardData } from '@/lib/types';
import { personas } from '@/lib/personas';
import SharingCard from '@/components/sharing-card';
import { db } from '@/lib/firebase-admin';

export const metadata: Metadata = {
  title: 'Leaderboard | The Executive Jokester',
  description: 'See the most viral satirical sharing cards.',
};

async function getLeaderboardData(): Promise<SavedCardData[]> {
  try {
    const cardsRef = db.collection('sharing_cards');
    const snapshot = await cardsRef.orderBy('viewCount', 'desc').limit(5).get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
        } as SavedCardData
    });

  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
}


export default async function LeaderboardPage() {
    const topCards = await getLeaderboardData();

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <Button asChild variant="outline">
                        <Link href="/"><ArrowLeft className="mr-2"/> Back to Generator</Link>
                    </Button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-3">
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10"/>
                        Highlight Reel
                    </h1>
                     <div className="w-24"></div>
                </div>

                {topCards.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">The leaderboard is currently empty.</p>
                        <p className="text-muted-foreground mt-2">Create and share your card to get on the board!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {topCards.map((cardData) => {
                             const persona = personas.find(p => p.id === cardData.personaId) || personas[0];
                             const cardProps = {
                                ...cardData,
                                persona
                             };
                            return (
                                <Link href={`/card/${cardData.id}`} key={cardData.id}>
                                    <SharingCard {...cardProps} />
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
             <footer className="py-8 mt-12 text-center text-muted-foreground text-sm">
                <p>A project by theexecutivejokester.com</p>
            </footer>
        </main>
    )
}
