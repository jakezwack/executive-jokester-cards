
export type CardTheme = 'Tactical' | 'Magazine';

export interface Persona {
  id: string;
  name: string;
  description: string;
  evolvedName: string;
  evolvedDescription: string;
}

export interface CardData {
  name: string;
  persona: Persona;
  imageUrl: string;
  theme: CardTheme;
  satiricalWit: string;
  bio?: string;
  isEvolved: boolean;
  customQuote?: string;
}

// This represents the data structure saved in Firestore
export interface SavedCardData {
  name: string;
  personaId: string;
  personaName: string;
  imageUrl: string;
  theme: CardTheme;
  satiricalWit: string;
  bio?: string;
  isEvolved: boolean;
  customQuote?: string;
  userProfileId: string;
  createdAt: any; // Firestore ServerTimestamp
  shareCount: number;
  engagementScore: number;
  lastSharedBy: string;
  viewCount: number;
}
