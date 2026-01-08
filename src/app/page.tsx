
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CardData } from '@/lib/types';
import ControlPanel from '@/components/control-panel';
import SharingCard from '@/components/sharing-card';
import SnapModeView from '@/components/snap-mode-view';
import { useToast } from '@/hooks/use-toast';
import { generateSatiricalWit } from '@/ai/flows/generate-satirical-wit';
import { saveCard } from '@/lib/actions';
import * as htmlToImage from 'html-to-image';
import { Target, Trophy } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useUser } from '@/firebase';
import { personas } from '@/lib/personas';

export default function Home() {
  const searchParams = useSearchParams();
  const counterPersonaId = searchParams.get('counter');

  const getDefaultPersona = useCallback(() => {
    if (counterPersonaId) {
      const counteredPersona = personas.find(p => p.id === counterPersonaId);
      if (counteredPersona && counteredPersona.counterPersonaId) {
        const counter = personas.find(p => p.id === counteredPersona.counterPersonaId);
        if (counter) {
          return counter;
        }
      }
      // Fallback if counter isn't defined: pick a different random one
      const otherPersonas = personas.filter(p => p.id !== counterPersonaId);
      if (otherPersonas.length > 0) {
        return otherPersonas[Math.floor(Math.random() * otherPersonas.length)];
      }
    }
    // Default random persona
    return personas[Math.floor(Math.random() * personas.length)];
  }, [counterPersonaId]);


  const defaultImage = PlaceHolderImages.find(img => img.id === 'user-default')?.imageUrl || 'https://picsum.photos/seed/user/400/400';
  
  const [cardData, setCardData] = useState<CardData>({
    name: 'Firstname Lastname',
    persona: getDefaultPersona(),
    imageUrl: defaultImage,
    theme: 'Tactical',
    satiricalWit: 'I put the "pro" in "procrastination".',
    bio: '',
    isEvolved: false,
    customQuote: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSnapMode, setShowSnapMode] = useState(false);
  const [lastSavedCardId, setLastSavedCardId] = useState<string | null>(null);


  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (auth && !user && !isUserLoading) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Could not sign in anonymously. Some features may be unavailable.",
        });
      });
    }
  }, [auth, user, isUserLoading, toast]);

  // When the counterPersonaId changes, update the persona in the cardData
  useEffect(() => {
    setCardData(prev => ({
      ...prev,
      persona: getDefaultPersona()
    }));
  }, [counterPersonaId, getDefaultPersona]);


  const handleDataChange = (data: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...data }));
    setLastSavedCardId(null); // Reset saved card ID when data changes
  };

  const handleGenerateWit = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSatiricalWit({
        name: cardData.name,
        title: cardData.persona.name,
        theme: cardData.theme,
        imageUrl: cardData.imageUrl,
        bio: cardData.bio,
      });
      if (result.satiricalWit) {
        setCardData(prev => ({ ...prev, satiricalWit: result.satiricalWit }));
      } else {
        throw new Error('Failed to generate wit. The result was empty.');
      }
    } catch (error) {
      console.error('Error generating wit:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate satirical wit. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCard = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be signed in to save a card.',
      });
      return;
    }
    setIsSaving(true);
    setLastSavedCardId(null);
    const result = await saveCard(cardData);
    if (result.success && result.docId) {
      setLastSavedCardId(result.docId);
      toast({
        title: 'Card Saved!',
        description: 'Your masterpiece has been saved to your collection.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: result.error || 'Could not save the card. Please check your configuration.',
      });
    }
    setIsSaving(false);
  };
  
  const handleExport = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }

    htmlToImage.toJpeg(cardRef.current, { quality: 0.95, backgroundColor: '#020617' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'satirical-card.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Export Failed',
          description: 'Could not export the card as an image.',
        });
      });
  }, [cardRef, toast]);


  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="flex flex-col md:flex-row min-h-screen">
        <ControlPanel
          cardData={cardData}
          onDataChange={handleDataChange}
          onGenerateWit={handleGenerateWit}
          onSaveCard={handleSaveCard}
          onExport={handleExport}
          isGenerating={isGenerating}
          isSaving={isSaving}
          showSnapMode={showSnapMode}
          setShowSnapMode={setShowSnapMode}
          lastSavedCardId={lastSavedCardId}
        />

        <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-grid-pattern [background-size:2rem_2rem] relative">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-primary">
            <Target className="w-8 h-8"/>
            <h1 className="text-xl font-bold tracking-tighter">Satirical Sharing Card Generator</h1>
          </div>
          <Link href="/leaderboard" className="absolute top-4 right-4 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <Trophy className="w-6 h-6"/>
            <span className="text-lg font-bold tracking-tight">Leaderboard</span>
          </Link>
          <SharingCard ref={cardRef} {...cardData} />
        </div>
      </div>
      
      <SnapModeView open={showSnapMode} onOpenChange={setShowSnapMode}>
        <SharingCard {...cardData} />
      </SnapModeView>
      
    </main>
  );
}
