import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function gets a single tenant's complete payment details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) {
      return NextResponse.json({ message: 'Tenant ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const tenantDetails = await db.collection("tenants").aggregate([
      // 1. Find the specific tenant
      { $match: { _id: new ObjectId(tenantId) } },
      
      // 2. Join with their room to get the rent amount
      { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" } },
      { $unwind: { path: "$roomInfo", preserveNullAndEmptyArrays: true } }, // Keep tenant even if room is deleted

      // 3. Join with their payments
      { $lookup: { from: "pg_payments", localField: "_id", foreignField: "tenantId", as: "payments" } },

      // 4. Perform calculations
      {
        $addFields: {
          rent: { $ifNull: ["$roomInfo.rent", 0] },
          // Calculate total months since tenant was created
          monthsSinceJoining: {
             $max: [1, { $add: [
                { $subtract: [currentMonth, { $month: "$createdAt" }] },
                { $multiply: [12, { $subtract: [currentYear, { $year: "$createdAt" }] }] },
                1
            ]}]
          },
          totalPaid: { $sum: "$payments.amount" },
        }
      },
      {
        $addFields: {
            totalRentObligation: { $multiply: ["$rent", "$monthsSinceJoining"] },
        }
      },
      {
        $addFields: {
            totalDueAmount: { $subtract: ["$totalRentObligation", "$totalPaid"] },
        }
      },
      // 5. Project the final fields
      {
        $project: {
          rent: 1,
          totalDueAmount: 1,
          paymentHistory: "$payments"
        }
      }
    ]).toArray();

    if (tenantDetails.length === 0) {
        return NextResponse.json({ message: 'Could not find details for this tenant.' }, { status: 404 });
    }

    return NextResponse.json(tenantDetails[0]);

  } catch (error) {
    console.error("Fetch Tenant Payment Details API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}