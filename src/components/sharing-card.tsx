
import { forwardRef } from 'react';
import Image from 'next/image';
import { CardData, SavedCardData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Target, Sparkles, Share2, Eye, BarChart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type SharingCardProps = CardData & Partial<Pick<SavedCardData, 'shareCount' | 'engagementScore' | 'lastSharedBy' | 'viewCount'>>;

const SharingCard = forwardRef<HTMLDivElement, SharingCardProps>((
  { name, persona, imageUrl, theme, satiricalWit, isEvolved, customQuote, viewCount, shareCount, engagementScore, lastSharedBy },
  ref
) => {

  const ejLogo = PlaceHolderImages.find(img => img.id === 'ej-logo')?.imageUrl || '';

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

  const personaName = isEvolved ? persona.evolvedName : persona.name;
  const personaDescription = isEvolved ? persona.evolvedDescription : satiricalWit;

  const AnalyticsBar = () => {
    if (typeof viewCount === 'undefined') return null;
    return (
      <div className="absolute bottom-10 left-0 w-full bg-black/30 backdrop-blur-sm p-1 text-xs text-white/80 flex justify-around items-center">
         <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{viewCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            <span>{shareCount?.toLocaleString() ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
            <BarChart className="w-3 h-3" />
            <span>{engagementScore?.toLocaleString() ?? 0}</span>
        </div>
         <div className="text-xs truncate max-w-[120px]">
            Shared by: <span className="font-bold">{lastSharedBy || 'N/A'}</span>
        </div>
      </div>
    )
  }

  if (theme === 'Magazine') {
    if (isEvolved) {
       return (
        <CardBase className="bg-white text-black font-headline border-4 border-amber-300">
          <div className="relative w-full h-full flex flex-col justify-center items-center text-center p-8 bg-slate-50">
             <div className="absolute inset-0 holographic-effect opacity-50"></div>
            <Sparkles className="w-12 h-12 text-amber-400 absolute top-8 right-8 animate-pulse" />
            <div className="relative w-32 h-32 mb-4">
              <Image src={imageUrl} alt={name} width={128} height={128} priority className="rounded-full border-4 border-amber-300 object-cover" data-ai-hint="headshot" />
            </div>
            <h2 className="text-3xl font-bold leading-tight text-gray-800">{name}</h2>
            <p className="text-lg text-amber-500 font-semibold">{personaName}</p>
            <p className="mt-4 text-md text-gray-600 italic max-w-xs">&ldquo;{personaDescription}&rdquo;</p>
            {customQuote && (
              <div className="mt-4 border-t-2 border-amber-200 pt-4 w-full">
                <p className="text-sm text-gray-500 font-semibold">&ldquo;{customQuote}&rdquo;</p>
              </div>
            )}
             <div className="absolute bottom-4 text-center w-full">
                {ejLogo && (
                    <Image src={ejLogo} alt="Logo" width={40} height={40} className="mx-auto filter grayscale brightness-0 invert opacity-20" data-ai-hint="logo circular" />
                )}
                <p className="text-xs text-gray-400 font-mono mt-1">
                    theexecutivejokester.com | ID: {persona.id.toUpperCase()}
                </p>
             </div>
             <AnalyticsBar />
          </div>
        </CardBase>
      );
    }
    return (
      <CardBase className="bg-slate-100 text-black font-headline">
        <div className="relative w-full h-full">
          <Image src={imageUrl} alt={name} fill priority style={{ objectFit: 'cover' }} data-ai-hint="portrait professional" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h2 className="text-4xl font-bold leading-tight">{name}</h2>
            <p className="text-lg text-amber-300">{persona.name}</p>
            <p className="mt-4 text-md italic max-w-xs">&ldquo;{satiricalWit}&rdquo;</p>
          </div>
           <div className="absolute top-4 right-4 text-white font-bold text-lg tracking-widest">
            EXEC JOKESTER
          </div>
          <AnalyticsBar />
        </div>
      </CardBase>
    );
  }

  // Tactical Theme (default)
  if (isEvolved) {
    return (
      <CardBase className="bg-card border-2 border-primary/50 p-1 animate-pulse-slow">
        <div className="w-full h-full border border-primary/30 bg-background p-6 flex flex-col justify-between relative text-center">
            <div className="absolute inset-0 holographic-effect"></div>
            <div className="absolute top-4 left-4 flex items-center gap-2 text-primary/70">
              <Sparkles className="w-6 h-6"/>
              <span className="font-bold">EVOLVED</span>
            </div>
            {ejLogo && (
                <Image src={ejLogo} alt="The Executive Jokester" width={50} height={50} className="absolute bottom-12 right-4 mix-blend-overlay filter hue-rotate-[280deg] saturate-200 opacity-70" data-ai-hint="logo circular" />
            )}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
               <div className="relative w-32 h-32">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={128}
                  height={128}
                  priority
                  className="rounded-full border-4 border-primary object-cover"
                  data-ai-hint="headshot"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                <p className="text-primary font-medium">{personaName}</p>
              </div>
              <p className="text-base text-foreground/90 max-w-xs italic">&ldquo;{personaDescription}&rdquo;</p>
               {customQuote && (
                <div className="mt-2 border-t-2 border-primary/20 pt-3 w-full max-w-xs">
                  <p className="text-sm text-muted-foreground font-semibold">&ldquo;{customQuote}&rdquo;</p>
                </div>
              )}
            </div>
            <div className="text-center text-xs text-muted-foreground font-mono relative">
              theexecutivejokester.com // {persona.id.toUpperCase()}
            </div>
        </div>
      </CardBase>
    );
  }

  return (
    <CardBase className="bg-card border-2 border-primary/50 p-1">
      <div className="w-full h-full border border-primary/30 bg-grid-pattern bg-ej-logo-pattern [background-size:2rem_2rem,auto] p-6 flex flex-col justify-between relative">
        <div className="flex justify-between items-start text-primary">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6"/>
            <span className="font-bold">EJ-CARD</span>
          </div>
          <div className="text-xs font-mono">ID: {(name || '').replace(/ /g,'').toUpperCase()}-2024</div>
        </div>
         {ejLogo && (
            <Image src={ejLogo} alt="The Executive Jokester" width={50} height={50} className="absolute bottom-12 right-4 opacity-40 mix-blend-overlay" data-ai-hint="logo circular" />
        )}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="relative w-32 h-32">
            <Image
              src={imageUrl}
              alt={name}
              width={128}
              height={128}
              priority
              className="rounded-full border-4 border-primary object-cover"
              data-ai-hint="headshot"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 animate-pulse ring-offset-4 ring-offset-card" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{name}</h2>
            <p className="text-primary font-medium">{persona.name}</p>

          </div>
          <p className="text-sm text-muted-foreground max-w-xs italic">&ldquo;{satiricalWit}&rdquo;</p>
        </div>

        <div className="text-center text-xs text-muted-foreground font-mono">
          theexecutivejokester.com // {persona.id.toUpperCase()}
        </div>
        <AnalyticsBar />
      </div>
    </CardBase>
  );
});

SharingCard.displayName = 'SharingCard';
export default SharingCard;
