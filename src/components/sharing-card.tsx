
import { forwardRef } from 'react';
import Image from 'next/image';
import { CardData, SavedCardData, Move } from '@/lib/types';
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
            <div className="mt-4 text-md text-gray-600 italic max-w-xs">&ldquo;{personaDescription}&rdquo;</div>
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
            <div className="mt-4 text-md italic max-w-xs">&ldquo;{satiricalWit}&rdquo;</div>
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
    const MoveCost = ({ move }: { move: Move }) => {
      let bgColor = 'bg-gray-700';
      if (move.type.toLowerCase() === 'fix') bgColor = 'bg-red-700';
      if (move.type.toLowerCase() === 'win') bgColor = 'bg-blue-700';
      if (move.type.toLowerCase() === 'skill') bgColor = 'bg-green-700';
      if (move.type.toLowerCase() === 'buff') bgColor = 'bg-yellow-700';

      return (
        <span className={cn(
          "w-5 h-5 inline-flex items-center justify-center font-bold text-xs rounded-full border border-white/50 flex-shrink-0 text-white shadow-sm ring-1 ring-white/20",
          bgColor
        )}>{move.icon}</span>
      )
    };

    return (
      <div
        ref={ref}
        className="w-[350px] h-[500px] rounded-[24px] relative overflow-hidden flex flex-col z-20 transform-style-3d border-8 border-neutral-900 shadow-[0_0_0_2px_hsl(var(--neon-gold)),0_25px_50px_-12px_rgba(0,0,0,0.7)] bg-black font-condensed"
      >
        <div className="absolute top-0 left-0 w-full h-full z-0 bg-black">
          <Image src={imageUrl} alt={name} fill priority className="w-full h-full object-cover object-center filter contrast-110 brightness-85" data-ai-hint="headshot comic" />
          <div className="vignette-overlay"></div>
        </div>
        <div className="holographic-card-overlay"></div>
        
        <div className="relative z-10 h-full flex flex-col text-white">
          {/* Header */}
          <div className="flex justify-between items-start px-4 pt-5 pb-1">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary block leading-none drop-shadow-md font-orbitron">{persona.evolvedName}</span>
              <h2 className="font-display text-2xl font-black leading-none text-white italic uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{name}</h2>
              <span className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">The Executive Jokester</span>
            </div>
            <div className="flex flex-col items-end">
                <div className="text-primary font-black text-2xl font-mono drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {Math.floor(1000 + Math.random() * 9000)}V
                </div>
                <div className="bg-primary/80 text-[7px] px-1 font-bold rounded-sm mt-1 uppercase text-black">
                  Evolved
                </div>
            </div>
          </div>
          
          <div className="flex-grow"></div>
          
          {/* Type Line */}
          <div className="mx-3 bg-gradient-to-r from-yellow-900/90 via-yellow-600/90 to-yellow-900/90 border-y border-yellow-400/50 px-3 py-1">
              <p className="text-[10px] font-bold italic text-white uppercase tracking-widest text-center">{persona.description}</p>
          </div>
          
          {/* Content Area */}
          <div className="mx-3 mb-3 mt-1 p-3 bg-slate-900/95 border border-white/10 rounded-b-lg flex flex-col justify-center gap-3 shadow-2xl">
              {persona.moves?.slice(0,2).map((move, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <MoveCost move={move} />
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[10px] uppercase text-primary leading-none font-orbitron">{move.name}</h4>
                      <span className="text-[10px] font-black text-white">{move.type}</span>
                    </div>
                    <p className="text-[9px] mt-0.5 leading-tight text-slate-300">{move.description}</p>
                  </div>
                </div>
              ))}
              
              {customQuote && (
                <div className="pt-1">
                    <p className="italic text-[8.5px] text-slate-400 font-medium text-center leading-tight">
                        &ldquo;{customQuote}&rdquo;
                    </p>
                </div>
              )}
          </div>
          
          {/* Footer */}
          <div className="bg-black/90 text-white p-2 px-4 flex justify-between items-center border-t border-primary/30">
            <div className="flex gap-3 text-[7px] font-mono uppercase tracking-tighter">
                <span>Authenticity: <span className="text-primary">100%</span></span>
                <span>Influence: <span className="text-blue-400">GLOBAL</span></span>
            </div>
            <div className="flex gap-2">
                <span className="text-[8px] font-black text-primary font-orbitron tracking-widest">JOKESTER.COM</span>
            </div>
          </div>
        </div>
      </div>
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
          <div className="text-sm text-muted-foreground max-w-xs italic">&ldquo;{satiricalWit}&rdquo;</div>
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
