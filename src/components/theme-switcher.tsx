'use client';

import { CardTheme } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type ThemeSwitcherProps = {
  theme: CardTheme;
  onThemeChange: (theme: CardTheme) => void;
};

export default function ThemeSwitcher({ theme, onThemeChange }: ThemeSwitcherProps) {
  return (
    <RadioGroup
      value={theme}
      onValueChange={(value: CardTheme) => onThemeChange(value)}
      className="grid grid-cols-2 gap-4"
    >
      <div>
        <RadioGroupItem value="Tactical" id="tactical" className="peer sr-only" />
        <Label
          htmlFor="tactical"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
        >
          Tactical
        </Label>
      </div>
      <div>
        <RadioGroupItem value="Magazine" id="magazine" className="peer sr-only" />
        <Label
          htmlFor="magazine"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
        >
          Magazine
        </Label>
      </div>
    </RadioGroup>
  );
}
