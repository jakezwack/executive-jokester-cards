
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import CardLoader from '@/components/card-loader';
import Link from 'next/link';

export default function Loading() {
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    <CardLoader />
                    <CardLoader />
                    <CardLoader />
                </div>
            </div>
             <footer className="py-8 mt-12 text-center text-muted-foreground text-sm">
                <p>A project by theexecutivejokester.com</p>
            </footer>
        </main>
    )
}
