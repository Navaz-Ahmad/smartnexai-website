import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function gets a single tenant's complete payment details for a specific month
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const date = searchParams.get('date'); // The new date parameter

    if (!tenantId || !date) {
      return NextResponse.json({ message: 'Tenant ID and date are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const selectedDate = new Date(date);
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const startOfNextMonth = new Date(selectedYear, selectedMonth + 1, 1);

    const tenantDetails = await db.collection("tenants").aggregate([
      { $match: { _id: new ObjectId(tenantId) } },
      { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" } },
      { $unwind: { path: "$roomInfo", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "pg_payments", localField: "_id", foreignField: "tenantId", as: "payments" } },
      {
        $addFields: {
          rent: { $ifNull: ["$roomInfo.rent", 0] },
          // Total paid up to the END of the selected month
          totalPaidBeforeMonthEnd: { $sum: { $map: {
            input: { $filter: { input: "$payments", as: "p", cond: { $lt: ["$$p.paymentDate", startOfNextMonth] } } },
            as: "pf", in: "$$pf.amount"
          }}},
          // Months from joining until the start of the selected month
          monthsActive: { $max: [1, { $add: [
              { $subtract: [selectedMonth, { $month: "$createdAt" }] },
              { $multiply: [12, { $subtract: [selectedYear, { $year: "$createdAt" }] }] },
              1
          ]}]},
        }
      },
      { $addFields: { totalRentObligation: { $multiply: ["$rent", "$monthsActive"] } } },
      { $addFields: { totalDueAmount: { $subtract: ["$totalRentObligation", "$totalPaidBeforeMonthEnd"] } } },
      {
        $project: {
          rent: 1,
          totalDueAmount: { $ifNull: ["$totalDueAmount", 0] },
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