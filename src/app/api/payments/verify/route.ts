import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

// **THE FIX IS HERE: The unused 'NextRequest' import has been removed.**

const pgDbUri = process.env.MONGODB_URI_PG;

export async function POST(request: Request) {
  try {
    if (!pgDbUri) {
        throw new Error("Missing MONGODB_URI_PG environment variable.");
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Missing RAZORPAY_KEY_SECRET environment variable.");
    }

    const { orderId, paymentId, signature, amount, currency, tenantId, pgId, roomId } = await request.json();

    if (!orderId || !paymentId || !signature || !tenantId) {
        return NextResponse.json({ message: 'Missing payment verification details.' }, { status: 400 });
    }

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    
    if (expectedSignature !== signature) {
        return NextResponse.json({ message: 'Payment verification failed. Invalid signature.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const newPayment = {
        tenantId: new ObjectId(tenantId),
        pgId: new ObjectId(pgId),
        roomId: new ObjectId(roomId),
        amount: amount,
        currency,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        paymentDate: new Date(),
    };

    await db.collection("pg_payments").insertOne(newPayment);

    return NextResponse.json({ message: 'Payment successful and recorded!' });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An internal server error occurred.";
    console.error("Verify Payment API Error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}