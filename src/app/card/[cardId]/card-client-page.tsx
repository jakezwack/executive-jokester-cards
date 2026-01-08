
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SavedCardData, CardData } from '@/lib/types';
import { personas } from '@/lib/personas';
import { incrementViewCount, submitCardForFeature } from '@/lib/actions';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import SharingCard from '@/components/sharing-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bomb, Sparkles, Gem, Award, Loader2 } from 'lucide-react';
import CardLoader from '@/components/card-loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CardClientPage({ cardId, initialCardData }: { cardId: string, initialCardData: SavedCardData | null }) {
  const [cardData, setCardData] = useState<SavedCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [story, setStory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (initialCardData) {
        const persona = personas.find(p => p.id === initialCardData.personaId) || personas[0];
        const combinedData = {
          ...initialCardData,
          persona: persona,
        };
        setCardData(combinedData as SavedCardData);
    }
    setIsLoading(false);
  }, [initialCardData]);

  useEffect(() => {
    if (cardId && typeof cardId === 'string') {
      incrementViewCount(cardId);
    }
  }, [cardId]);

  const handleSubmitForFeature = async () => {
    if (!story.trim()) {
        toast({
            variant: "destructive",
            title: "Story is empty",
            description: "Please share your inspirational story before submitting.",
        });
        return;
    }
    setIsSubmitting(true);
    const result = await submitCardForFeature(cardId, story);
    setIsSubmitting(false);

    if (result.success) {
        toast({
            title: "Submission Successful!",
            description: "Your card has been submitted for review. Good luck!",
        });
        setShowSubmitDialog(false);
        // Optimistically update the UI
        setCardData(prev => prev ? { ...prev, submissionStatus: 'pending' } : null);
    } else {
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: result.error || "An unexpected error occurred.",
        });
    }
};

  const isOwner = user && cardData && user.uid === cardData.userProfileId;

  const getSubmissionStatusUI = () => {
    if (!isOwner) return null;

    switch (cardData?.submissionStatus) {
        case 'pending':
            return <div className="mt-6 text-center text-amber-400 font-semibold p-3 bg-amber-400/10 rounded-lg border border-amber-400/20">Awaiting Review</div>;
        case 'approved':
            return <div className="mt-6 text-center text-green-400 font-semibold p-3 bg-green-400/10 rounded-lg border border-green-400/20">Approved & Featured!</div>;
        case 'rejected':
             return <div className="mt-6 text-center text-red-400 font-semibold p-3 bg-red-400/10 rounded-lg border border-red-400/20">Submission Not Approved</div>;
        default:
            return (
                <Button size="lg" className="w-full mt-4" variant="outline" onClick={() => setShowSubmitDialog(true)}>
                    <Award className="mr-2"/> Submit For Feature
                </Button>
            );
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <CardLoader />
      </div>
    );
  }

  if (!cardData) {
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

  const { persona, ...restOfCardData } = cardData;

  const cardProps = {
    ...restOfCardData,
    persona: persona || personas.find(p => p.id === cardData.personaId) || personas[0],
  }


  return (
    <main className="min-h-screen bg-background text-foreground font-body flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
         <Button asChild variant="outline">
          <Link href="/"><ArrowLeft className="mr-2"/> Back to Generator</Link>
        </Button>
      </div>
      <div className="flex flex-col items-center gap-8">
        <SharingCard {...cardProps} />
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button asChild size="lg" className="w-full bg-primary/90 hover:bg-primary text-primary-foreground animate-pulse">
            <Link href="/">
              <Sparkles className="mr-2"/>
              EVOLVE THIS SOUL
            </Link>
          </Button>
           {getSubmissionStatusUI()}
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
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit for Feature</DialogTitle>
            <DialogDescription>
              Share your inspirational story behind this persona. If selected, your card and story will be featured on our site!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="story" className="text-right">
                Story
              </Label>
              <Textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="col-span-3 min-h-[120px]"
                placeholder="Tell us what makes this persona special..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitForFeature} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Story"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
