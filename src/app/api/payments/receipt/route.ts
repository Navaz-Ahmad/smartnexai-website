import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function fetches all details needed for a single payment receipt.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    if (!paymentId) {
      return NextResponse.json({ message: 'Payment ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const receiptData = await db.collection("pg_payments").aggregate([
      // 1. Find the specific payment
      { $match: { _id: new ObjectId(paymentId) } },
      
      // 2. Join with the tenant to get their name and contact info
      { $lookup: { from: "tenants", localField: "tenantId", foreignField: "_id", as: "tenantInfo" } },
      { $unwind: "$tenantInfo" },

      // 3. Join with the PG to get its name
      { $lookup: { from: "pgs", localField: "pgId", foreignField: "_id", as: "pgInfo" } },
      { $unwind: "$pgInfo" },

      // 4. Join with the room to get the room number
      { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" } },
      { $unwind: "$roomInfo" },

      // 5. Reshape the data for a clean receipt output
      {
        $project: {
            _id: 1,
            amount: 1,
            paymentDate: 1,
            razorpayPaymentId: 1,
            tenantName: "$tenantInfo.name",
            tenantMobile: "$tenantInfo.mobile",
            pgName: "$pgInfo.name",
            pgAddress: "$pgInfo.address",
            roomNumber: "$roomInfo.roomNumber"
        }
      }
    ]).toArray();

    if (receiptData.length === 0) {
        return NextResponse.json({ message: 'Receipt not found.' }, { status: 404 });
    }

    return NextResponse.json({ receipt: receiptData[0] });

  } catch (error) {
    console.error("Fetch Receipt API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}