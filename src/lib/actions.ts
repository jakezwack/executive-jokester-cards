'use server';

import { collection, addDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { CardData } from './types';
import { getAuth } from 'firebase/auth';

export async function saveCard(cardData: CardData): Promise<{ success: boolean; error?: string; docId?: string }> {
  try {
    const { firestore, auth } = initializeFirebase();
    const user = auth.currentUser;

    if (!user) {
      return { success: false, error: 'You must be logged in to save a card.' };
    }

    // Omit the persona object description before saving, we only need the name
    const { persona, ...restOfCardData } = cardData;
    const dataToSave = {
      ...restOfCardData,
      persona: persona.name, // save only the name
      userProfileId: user.uid,
      createdAt: serverTimestamp(),
    };


    const docRef = await addDoc(collection(firestore, `users/${user.uid}/sharing_cards`), dataToSave);

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
