
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { partnerChatFlow, type PartnerChatInput, type PartnerChatOutput } from '@/ai/flows/partner-chat-flow';

// The form submission logic is no longer needed on the page, but we'll keep it here
// in case it's needed for other purposes in the future. It is not currently used.
interface PartnerInquiryData {
  name: string;
  designation: string;
  organization: string;
  email: string;
  whatsapp: string;
}

export async function submitPartnerInquiry(data: PartnerInquiryData): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseEnabled || !db) {
    console.error('Firebase is not configured. Partner inquiry cannot be saved.');
    // Simulate success for user-facing flow if backend is not ready
    return { success: true, message: 'Your inquiry has been submitted successfully.' };
  }

  try {
    await addDoc(collection(db, 'partnerInquiries'), {
      ...data,
      submittedAt: serverTimestamp(),
    });
    return { success: true, message: 'Your inquiry has been submitted successfully. We will get in touch with you shortly!' };
  } catch (error) {
    console.error('Error saving partner inquiry to Firestore:', error);
    return { success: false, message: 'Could not save your inquiry. Please try again later.' };
  }
}

export async function partnerChatAction(input: PartnerChatInput): Promise<PartnerChatOutput> {
    try {
        return await partnerChatFlow(input);
    } catch (error) {
        console.error('Error in Partner Chat action:', error);
        throw new Error('Failed to get a response from the AI.');
    }
}
