import { forwardRef } from 'react';
import Image from 'next/image';
import { CardData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Target } from 'lucide-react';

const SharingCard = forwardRef<HTMLDivElement, CardData>((
  { name, title, imageUrl, theme, satiricalWit },
  ref
) => {

  const CardBase = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div
      ref={ref}
      className={cn(
        "w-[400px] h-[500px] shadow-2xl shadow-primary/20 transition-all duration-500 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );

  if (theme === 'Magazine') {
    return (
      <CardBase className="bg-slate-100 text-black font-headline">
        <div className="relative w-full h-full">
          <Image src={imageUrl} alt={name} fill style={{ objectFit: 'cover' }} data-ai-hint="portrait professional" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h2 className="text-4xl font-bold leading-tight">{name}</h2>
            <p className="text-lg text-amber-300">{title}</p>
            <p className="mt-4 text-md italic max-w-xs">&ldquo;{satiricalWit}&rdquo;</p>
          </div>
           <div className="absolute top-4 right-4 text-white font-bold text-lg tracking-widest">
            EXEC JOKESTER
          </div>
        </div>
      </CardBase>
    );
  }

  // Tactical Theme (default)
  return (
    <CardBase className="bg-card border-2 border-primary/50 p-1">
      <div className="w-full h-full border border-primary/30 bg-grid-pattern [background-size:2rem_2rem] p-6 flex flex-col justify-between relative">
        <div className="flex justify-between items-start text-primary">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6"/>
            <span className="font-bold">EJ-CARD</span>
          </div>
          <div className="text-xs font-mono">ID: {(name || '').replace(/ /g,'').toUpperCase()}-2024</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="relative w-32 h-32">
            <Image
              src={imageUrl}
              alt={name}
              width={128}
              height={128}
              className="rounded-full border-4 border-primary object-cover"
              data-ai-hint="headshot"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 animate-pulse ring-offset-4 ring-offset-card" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
            <p className="text-primary font-medium">{title}</p>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs italic">&ldquo;{satiricalWit}&rdquo;</p>
        </div>

        <div className="text-center text-xs text-muted-foreground font-mono">
          theexecutivejokester.com // S-CLASS ASSET
        </div>
      </div>
    </CardBase>
  );
});

SharingCard.displayName = 'SharingCard';
export default SharingCard;
