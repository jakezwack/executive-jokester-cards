'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { ShoppingCart, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

interface MarketplaceLink {
  id: string;
  marketplace: string;
  productUrl: string;
  productName: string;
}

// Temporary mock data to demonstrate the feature
const mockLinks: MarketplaceLink[] = [
  {
    id: '1',
    marketplace: 'Wealthy Affiliate',
    productUrl: 'https://www.wealthyaffiliate.com?a_aid=d4e8832e',
    productName: 'Learn Affiliate Marketing',
  },
  {
    id: '2',
    marketplace: 'Amazon',
    productUrl: 'https://www.amazon.com/gp/css/homepage.html?&linkCode=ll2&tag=gaggiftsfor06-20&linkId=39c50ad279ee31ee92e4b205c17595d2&language=en_US&ref_=as_li_ss_tl',
    productName: 'Shop on Amazon',
  },
];

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

export default function MarketplaceLinks({ cardId }: { cardId: string }) {
  const firestore = useFirestore();

  const linksQuery = useMemoFirebase(() => {
    if (!firestore || !cardId) return null;
    return query(collection(firestore, `sharing_cards/${cardId}/marketplace_links`));
  }, [firestore, cardId]);

  const { data: links, isLoading } = useCollection<MarketplaceLink>(linksQuery);

  const linksToDisplay = (links && links.length > 0) ? links : mockLinks;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  // Only render the container if there are links to show
  if (!linksToDisplay || linksToDisplay.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-2">
      {linksToDisplay.map((link) => (
        <Button key={link.id} asChild size="lg" className="w-full" variant="secondary">
          <Link href={link.productUrl} target="_blank" rel="noopener noreferrer">
            <MarketplaceIcon name={link.marketplace} />
            {link.productName}
          </Link>
        </Button>
      ))}
    </div>
  );
}
