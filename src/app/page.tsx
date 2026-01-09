
import { Suspense } from 'react';
import HomePageClient from './home-page-client';
import CardLoader from '@/components/card-loader';


export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background text-foreground font-body flex items-center justify-center"><CardLoader /></main>}>
      <HomePageClient />
    </Suspense>
  );
}
