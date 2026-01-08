'use server';

import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { CardData } from './types';

export async function saveCard(cardData: CardData): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      ...cardData,
      createdAt: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true };
  } catch (e) {
    console.error('Error adding document: ', e);
    if (e instanceof Error) {
        return { success: false, error: e.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
