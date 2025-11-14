import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import Razorpay from "razorpay";
import { updateUserDoc } from "@/services/firestore";
import type { UserSubscription } from "@/types";

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  
  try {
    const body = await req.text();
    const signature = headers().get("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(body);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 400 });
    }
    
    const payload = JSON.parse(body);

    if (payload.event === 'payment.captured') {
        const paymentEntity = payload.payload.payment.entity;
        const orderId = paymentEntity.order_id;

        // Fetch the order from Razorpay to get the notes
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const order = await razorpay.orders.fetch(orderId);
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
            paymentId: paymentEntity.id,
            orderId: orderId,
            expiresAt: expiresAt.toISOString(),
        };

        await updateUserDoc(uid, { subscription: subscriptionData });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error in Razorpay webhook:", error);
    const err = error as Error;
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
