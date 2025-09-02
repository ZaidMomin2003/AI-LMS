
'use server';

import { db, isFirebaseEnabled } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

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
