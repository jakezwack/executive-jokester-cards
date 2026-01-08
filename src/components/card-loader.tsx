
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function CardLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={cn(
        "w-[400px] h-[500px] shadow-2xl shadow-primary/20 transition-all duration-500 overflow-hidden",
        "bg-card border-2 border-primary/30 p-1"
      )}>
        <div className="w-full h-full border border-primary/20 bg-background p-6 flex flex-col items-center justify-center text-center gap-4 shimmer-effect">
          
          <div className="relative w-32 h-32 bg-muted/50 rounded-full" />
          
          <div className="space-y-2">
            <div className="w-48 h-6 bg-muted/50 rounded-md" />
            <div className="w-32 h-4 bg-muted/50 rounded-md mx-auto" />
          </div>

          <div className="w-64 h-8 bg-muted/50 rounded-md mt-2" />

        </div>
      </div>
      <div className="flex items-center gap-2 text-primary">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-lg text-muted-foreground">Summoning Holographic Soul...</p>
      </div>
    </div>
  );
}
