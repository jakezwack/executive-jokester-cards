export type CardTheme = 'Tactical' | 'Magazine';

export interface Persona {
  id: string;
  name: string;
  description: string;
}

export interface CardData {
  name: string;
  persona: Persona;
  imageUrl: string;
  theme: CardTheme;
  satiricalWit: string;
  bio?: string;
}
