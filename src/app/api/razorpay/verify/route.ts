
import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { updateUserDoc } from "@/services/firestore";
import type { UserSubscription } from "@/types";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  
  const razorpay_order_id = params.get("razorpay_order_id");
  const razorpay_payment_id = params.get("razorpay_payment_id");
  const razorpay_signature = params.get("razorpay_signature");

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.redirect(new URL('/pricing?error=invalid_payment', req.url));
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.redirect(new URL('/pricing?error=verification_failed', req.url));
  }

  try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    
    // Fetch the order to get the notes
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const { uid, priceId } = order.notes as { uid: string, priceId: string };

    if (!uid || !priceId) {
        throw new Error("Missing user ID or price ID in order notes.");
    }

    const planDurations: Record<string, number> = {
        SAGE_MODE_YEARLY: 365,
        SAGE_MODE_6_MONTHS: 180,
        SAGE_MODE_3_MONTHS: 90,
    };

    const durationInDays = planDurations[priceId];
    if (!durationInDays) {
        throw new Error(`Invalid priceId: ${priceId}`);
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationInDays);

    const subscriptionData: UserSubscription = {
        planName: "Sage Mode",
        status: "active",
        priceId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        expiresAt: expiresAt.toISOString(),
    };

    await updateUserDoc(uid, { subscription: subscriptionData });
    
    return NextResponse.redirect(new URL('/dashboard?payment_success=true', req.url));

  } catch (error) {
    console.error("Error during Razorpay verification and DB update:", error);
    return NextResponse.redirect(new URL('/pricing?error=update_failed', req.url));
  }
}
