
import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateUserDoc } from "@/services/firestore";
import { isFirebaseEnabled } from "@/lib/firebase";
import type { UserSubscription } from "@/types";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    uid,
    priceId,
  } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !uid || !priceId) {
      return NextResponse.json({ success: false, message: "Missing required payment information." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ success: false, message: "Invalid signature." }, { status: 400 });
  }

  if (!isFirebaseEnabled) {
    return NextResponse.json({
      success: false,
      message: "Firebase not enabled.",
    }, { status: 500 });
  }

  const planDurations: Record<string, number> = {
    SAGE_MODE_YEARLY: 365,
    SAGE_MODE_6_MONTHS: 180,
    SAGE_MODE_3_MONTHS: 90,
  };

  const durationInDays = planDurations[priceId];
  if (!durationInDays) {
    return NextResponse.json({ success: false, message: "Invalid priceId." }, { status: 400 });
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

  try {
    await updateUserDoc(uid, { subscription: subscriptionData });
    return NextResponse.json({ success: true, message: "Subscription updated successfully." });
  } catch (err) {
    console.error("Error updating Firestore:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to update subscription in the database.",
    }, { status: 500 });
  }
}

    