
export type CardTheme = 'Tactical' | 'Magazine';

export interface Persona {
  id: string;
  name: string;
  description: string;
  evolvedName: string;
  evolvedDescription: string;
  counterPersonaId?: string;
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

export type SubmissionStatus = 'none' | 'pending' | 'approved' | 'rejected';

// This represents the data structure saved in Firestore
export interface SavedCardData {
  id: string; // Add id field here
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
  submissionStatus?: SubmissionStatus;
  inspirationalStory?: string;
}
