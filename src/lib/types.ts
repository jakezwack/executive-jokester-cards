export type CardTheme = 'Tactical' | 'Magazine';

export interface CardData {
  name: string;
  title: string;
  imageUrl: string;
  theme: CardTheme;
  satiricalWit: string;
}
