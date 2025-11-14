
'use server';

import 'dotenv/config';
import { updateUserDoc } from '@/services/firestore';
import type { UserSubscription } from '@/types';
import { isFirebaseEnabled } from '@/lib/firebase';

export async function upgradeSubscriptionAction(uid: string, priceId: string): Promise<{ success: boolean }> {
    if (!uid || !isFirebaseEnabled) {
        return { success: false };
    }

    const planDurations: Record<string, number> = {
        SAGE_MODE_YEARLY: 365,
        SAGE_MODE_6_MONTHS: 180,
        SAGE_MODE_3_MONTHS: 90,
    };
    
    const durationInDays = planDurations[priceId];
    if (!durationInDays) {
        return { success: false };
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationInDays);

    const subscriptionData: UserSubscription = {
        planName: "Sage Mode",
        status: "active",
        priceId: priceId,
        expiresAt: expiresAt.toISOString(),
    };

    try {
        await updateUserDoc(uid, { subscription: subscriptionData });
        return { success: true };
    } catch (error) {
        console.error("Error upgrading subscription:", error);
        return { success: false };
    }
}

export async function downgradeToHobbyAction(uid: string): Promise<{ success: boolean }> {
    if (!uid || !isFirebaseEnabled) {
        return { success: false };
    }
    
    const hobbySubscription: UserSubscription = {
        planName: 'Hobby',
        status: 'active',
    };

    try {
        await updateUserDoc(uid, { subscription: hobbySubscription });
        return { success: true };
    } catch (error) {
        console.error("Error downgrading to Hobby plan:", error);
        return { success: false };
    }
}
    
