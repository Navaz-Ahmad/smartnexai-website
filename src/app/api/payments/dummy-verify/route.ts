import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This is a DUMMY endpoint for testing. It does NOT verify any payment.
// It simply trusts the data from the app and saves it.
export async function POST(request: Request) {
  try {
    const { amount, currency, tenantId, pgId, roomId } = await request.json();

    if (!amount || !tenantId || !pgId || !roomId) {
        return NextResponse.json({ message: 'Missing details for dummy payment.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const newPayment = {
        tenantId: new ObjectId(tenantId),
        pgId: new ObjectId(pgId),
        roomId: new ObjectId(roomId),
        amount: Number(amount),
        currency: currency || 'INR',
        // Add dummy Razorpay IDs to maintain schema consistency
        razorpayOrderId: `dummy_order_${new Date().getTime()}`,
        razorpayPaymentId: `dummy_pay_${new Date().getTime()}`,
        paymentDate: new Date(),
    };

    await db.collection("pg_payments").insertOne(newPayment);

    return NextResponse.json({ message: 'Dummy payment successful and recorded!' });

  } catch (error) {
    console.error("Dummy Verify Payment API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}