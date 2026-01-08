
'use server';

import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { CardData } from './types';

export async function saveCard(cardData: CardData): Promise<{ success: boolean; error?: string; docId?: string }> {
  try {
    const { firestore, auth } = initializeFirebase();
    const user = auth.currentUser;

    if (!user) {
      return { success: false, error: 'You must be logged in to save a card.' };
    }
    
    const { persona, ...restOfCardData } = cardData;
    const dataToSave = {
      ...restOfCardData,
      personaName: persona.name, // save only the name
      personaId: persona.id,
      userProfileId: user.uid,
      createdAt: serverTimestamp(),
      // Initialize analytics fields for the leaderboard
      shareCount: 0,
      engagementScore: 0,
      lastSharedBy: user.displayName || 'Anonymous',
      viewCount: 0,
    };

    // Save to the new top-level sharing_cards collection
    const docRef = await addDoc(collection(firestore, 'sharing_cards'), dataToSave);

    console.log('Document written with ID: ', docRef.id);
    return { success: true, docId: docRef.id };
  } catch (e) {
    console.error('Error adding document: ', e);
    if (e instanceof Error) {
        return { success: false, error: e.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function incrementViewCount(cardId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { firestore } = initializeFirebase();
    const cardRef = doc(firestore, 'sharing_cards', cardId);
    await updateDoc(cardRef, {
      viewCount: increment(1)
    });
    return { success: true };
  } catch (e) {
    console.error('Error incrementing view count: ', e);
    if (e instanceof Error) {
        return { success: false, error: e.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
