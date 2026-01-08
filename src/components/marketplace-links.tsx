'use client';

import { useMemo, useState } from 'react';
import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { ShoppingCart, GraduationCap, Bot, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { Persona } from '@/lib/types';
import { suggestProducts, SuggestProductsOutput } from '@/ai/flows/suggest-products';

interface MarketplaceLink {
  id: string;
  marketplace: string;
  productUrl: string;
  productName: string;
}

const MarketplaceIcon = ({ name }: { name: string }) => {
  switch (name.toLowerCase()) {
    case 'amazon':
      return <ShoppingCart className="mr-2" />;
    case 'wealthy affiliate':
      return <GraduationCap className="mr-2" />;
    default:
      return <ShoppingCart className="mr-2" />;
  }
};

export default function MarketplaceLinks({ cardId, persona }: { cardId: string; persona: Persona; }) {
  const firestore = useFirestore();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestProductsOutput['products']>([]);

  const linksQuery = useMemoFirebase(() => {
    if (!firestore || !cardId) return null;
    return query(collection(firestore, `sharing_cards/${cardId}/marketplace_links`));
  }, [firestore, cardId]);

  const { data: links, isLoading } = useCollection<MarketplaceLink>(linksQuery);
  
  // Wealthy Affiliate and Amazon links with your affiliate tag
  const staticLinks: MarketplaceLink[] = [
    {
      id: 'static-1',
      marketplace: 'Wealthy Affiliate',
      productUrl: 'https://www.wealthyaffiliate.com?a_aid=d4e8832e',
      productName: 'Learn Affiliate Marketing',
    },
    {
      id: 'static-2',
      marketplace: 'Amazon',
      productUrl: 'https://www.amazon.com/gp/css/homepage.html?&linkCode=ll2&tag=gaggiftsfor06-20&linkId=39c50ad279ee31ee92e4b205c17595d2&language=en_US&ref_=as_li_ss_tl',
      productName: 'Shop on Amazon',
    },
  ];

  const handleSuggestProducts = async () => {
    setIsSuggesting(true);
    setAiSuggestions([]);
    try {
        const result = await suggestProducts({
            personaName: persona.name,
            personaDescription: persona.description
        });
        if (result && result.products) {
            setAiSuggestions(result.products);
        }
    } catch (error) {
        console.error("Failed to suggest products:", error);
    } finally {
        setIsSuggesting(false);
    }
  };

  const constructAmazonUrl = (searchQuery: string) => {
    const baseUrl = "https://www.amazon.com/s";
    const params = new URLSearchParams({
        k: searchQuery,
        tag: "gaggiftsfor06-20", // Your affiliate tag
    });
    return `${baseUrl}?${params.toString()}`;
  }
  
  const allLinks = useMemo(() => {
    const dbLinks = links || [];
    // If there are links in the DB, show only those. Otherwise, show the static ones.
    return dbLinks.length > 0 ? dbLinks : staticLinks;
  }, [links, staticLinks]);


  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-2">
      {allLinks.map((link) => (
        <Button key={link.id} asChild size="lg" className="w-full" variant="secondary">
          <Link href={link.productUrl} target="_blank" rel="noopener noreferrer">
            <MarketplaceIcon name={link.marketplace} />
            {link.productName}
          </Link>
        </Button>
      ))}
      <Button size="lg" className="w-full" variant="outline" onClick={handleSuggestProducts} disabled={isSuggesting}>
        {isSuggesting ? <Loader2 className="animate-spin" /> : <Bot className="mr-2" />}
        Get AI-Suggested Gear
      </Button>

      {aiSuggestions.map((suggestion, index) => (
          <Button key={index} asChild size="lg" className="w-full" variant="default">
              <Link href={constructAmazonUrl(suggestion.amazonSearchQuery)} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2" />
                  {suggestion.productName}
              </Link>
          </Button>
      ))}
    </div>
  );
}
