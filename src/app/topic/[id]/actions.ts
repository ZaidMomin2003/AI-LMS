
'use server';

import { getAdminDB } from '@/lib/firebase-admin';
import type { Topic } from '@/types';
import { explainText, type ExplainTextInput, type ExplainTextOutput } from '@/ai/flows/explain-text-flow';

export async function explainTextAction(input: ExplainTextInput): Promise<ExplainTextOutput> {
  try {
    const result = await explainText(input);
    return result;
  } catch (error) {
    console.error('Error getting explanation from AI:', error);
    throw new Error('Failed to get an explanation from the AI. Please try again.');
  }
}


export async function createShareableTopicAction(topicDataString: string): Promise<string> {
  const db = getAdminDB();
  if (!db) {
    console.error("Firebase Admin DB not configured. Sharing is disabled.");
    throw new Error("The sharing service is temporarily unavailable.");
  }

  try {
    // Parse the JSON string back into an object
    const topicData = JSON.parse(topicDataString);
    
    const shareableCollectionRef = db.collection('sharedTopics');
    const docRef = await shareableCollectionRef.add(topicData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating shareable topic in Firestore:", error);
    throw new Error("Could not create a shareable link for this topic.");
  }
}
