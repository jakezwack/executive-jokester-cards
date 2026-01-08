export type CardTheme = 'Tactical' | 'Magazine';

export interface CardData {
  realtorName: string;
  realtorTitle: string;
  realtorImageUrl: string;
  theme: CardTheme;
  satiricalWit: string;
}
