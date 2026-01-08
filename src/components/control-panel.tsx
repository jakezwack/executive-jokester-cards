'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CardData, Persona } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Upload, WandSparkles, Save, Download, Camera, Loader2, Sparkles } from 'lucide-react';
import ThemeSwitcher from './theme-switcher';
import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { personas } from '@/lib/personas';


type ControlPanelProps = {
  cardData: CardData;
  onDataChange: (data: Partial<CardData>) => void;
  onGenerateWit: () => void;
  onSaveCard: () => void;
  onExport: () => void;
  isGenerating: boolean;
  isSaving: boolean;
  showSnapMode: boolean;
  setShowSnapMode: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50, 'Name is too long'),
  personaId: z.string(),
  imageUrl: z.string().url('Please enter a valid URL'),
  bio: z.string().max(200, 'Bio is too long').optional(),
  customQuote: z.string().max(140, 'Quote is too long').optional(),
});

export default function ControlPanel({
  cardData,
  onDataChange,
  onGenerateWit,
  onSaveCard,
  onExport,
  isGenerating,
  isSaving,
  showSnapMode,
  setShowSnapMode
}: ControlPanelProps) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cardData.name,
      personaId: cardData.persona.id,
      imageUrl: cardData.imageUrl,
      bio: cardData.bio || '',
      customQuote: cardData.customQuote || '',
    },
    mode: 'onBlur',
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue('imageUrl', result, { shouldValidate: true });
        onDataChange({ imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonaChange = (personaId: string) => {
    const selectedPersona = personas.find(p => p.id === personaId);
    if (selectedPersona) {
      onDataChange({ persona: selectedPersona });
    }
  };

  const toggleEvolve = () => {
    onDataChange({ isEvolved: !cardData.isEvolved });
  };

  return (
    <div className="w-full md:w-[380px] md:min-w-[380px] bg-card md:border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">Controls</h2>
        <p className="text-sm text-muted-foreground">Customize your sharing card.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <Form {...form}>
          <form onBlur={form.handleSubmit((data) => onDataChange({ name: data.name, customQuote: data.customQuote, bio: data.bio }))} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Profile Details</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Persona</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); handlePersonaChange(value); }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a persona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {personas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id}>{persona.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {cardData.isEvolved
                        ? personas.find(p => p.id === field.value)?.evolvedDescription
                        : personas.find(p => p.id === field.value)?.description
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://..." {...field} />
                        <Button asChild variant="outline" size="icon" className="shrink-0">
                          <label htmlFor="file-upload" className="cursor-pointer"><Upload className="h-4 w-4"/></label>
                        </Button>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Comedy Style</h3>
                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Give the AI a taste of your comedy..." {...field} />
                    </FormControl>
                     <FormDescription>
                      This helps the AI match your personal style of humor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {cardData.isEvolved && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">Inspirational Coin</h3>
                  <FormField
                    control={form.control}
                    name="customQuote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Quote</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Stamp your wisdom onto the card..." {...field} />
                        </FormControl>
                        <FormDescription>
                          This quote will be displayed on your evolved card.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-medium mb-4">Card Theme</h3>
              <ThemeSwitcher
                theme={cardData.theme}
                onThemeChange={(theme) => onDataChange({ theme })}
              />
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={toggleEvolve} variant="secondary">
                  <Sparkles />
                  {cardData.isEvolved ? 'Devolve' : 'Evolve'}
                </Button>
                <Button onClick={onGenerateWit} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="animate-spin" /> : <WandSparkles />}
                  Generate Wit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      
      <div className="p-4 border-t border-border mt-auto space-y-4 bg-card">
        <div className="flex items-center justify-between">
            <Label htmlFor="snap-mode" className="flex items-center gap-2 cursor-pointer">
              <Camera/>
              Snap Mode
            </Label>
            <Switch
              id="snap-mode"
              checked={showSnapMode}
              onCheckedChange={setShowSnapMode}
            />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onSaveCard} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
            Save
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download />
            Export
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground pt-2">
            A project by theexecutivejokester.com 
        </p>
      </div>
    </div>
  );
}
