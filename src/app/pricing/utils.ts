
import type { SubscriptionPlan } from '@/types';

const planDetails: Record<string, { planName: SubscriptionPlan; price: string }> = {
  'price_1RiJCmRsI0LGhGhHY7V3VcWp': { planName: 'Rapid Student', price: '7' },
  'price_1RiJCjRsI0LGhGhHmmDzBMCk': { planName: 'Scholar Subscription', price: '19' },
  'price_1RiJCeRsI0LGhGhHhZXB4MEg': { planName: 'Sage Mode', price: '169' },
};

export function getPlanDetails(priceId: string) {
  return planDetails[priceId];
}
