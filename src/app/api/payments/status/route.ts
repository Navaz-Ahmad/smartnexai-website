import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId');
    const date = searchParams.get('date');

    if (!pgId || !date) {
      return NextResponse.json({ message: 'PG ID and date are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const selectedDate = new Date(date);
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const startOfNextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);

    const tenantStatuses = await db.collection("tenants").aggregate([
      { $match: { pgId: new ObjectId(pgId), roomId: { $ne: null }, createdAt: { $lt: startOfNextMonth } }},
      { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" } },
      { $unwind: "$roomInfo" },
      { $lookup: { from: "pg_payments", localField: "_id", foreignField: "tenantId", as: "payments" } },
      {
        $addFields: {
          rent: { $ifNull: ["$roomInfo.rent", 0] },
          totalPaidBeforeMonthEnd: { $sum: { $map: { input: { $filter: { input: "$payments", as: "p", cond: { $lt: ["$$p.paymentDate", startOfNextMonth] } } }, as: "pf", in: "$$pf.amount" }}},
          paymentsInSelectedMonth: { $filter: { input: "$payments", as: "p", cond: { $and: [ { $gte: ["$$p.paymentDate", startOfMonth] }, { $lt: ["$$p.paymentDate", startOfNextMonth] } ] } } },
          monthsActive: { $max: [1, { $add: [ { $subtract: [selectedDate.getMonth(), { $month: "$createdAt" }] }, { $multiply: [12, { $subtract: [selectedDate.getFullYear(), { $year: "$createdAt" }] }] }, 1 ]}]},
        }
      },
      { $addFields: { 
          paidInSelectedMonth: { $sum: "$paymentsInSelectedMonth.amount" },
          // **THE FIX IS HERE: Get the ID of the most recent payment in the month.**
          paymentId: { $first: "$paymentsInSelectedMonth._id" } 
      }},
      { $addFields: { totalRentObligation: { $multiply: ["$rent", "$monthsActive"] } } },
      { $addFields: { totalDueAmount: { $subtract: ["$totalRentObligation", "$totalPaidBeforeMonthEnd"] } } },
      {
        $addFields: {
          currentMonthStatus: {
            $switch: {
              branches: [
                { case: { $gte: ["$paidInSelectedMonth", "$rent"] }, then: "Paid" },
                { case: { $and: [ { $gt: ["$paidInSelectedMonth", 0] }, { $lt: ["$paidInSelectedMonth", "$rent"] } ] }, then: "Partially Paid" },
              ], default: "Unpaid"
            }
          }
        }
      },
      {
        $project: {
          _id: 1, name: 1, mobile: 1, roomNumber: "$roomInfo.roomNumber",
          totalDueAmount: { $ifNull: ["$totalDueAmount", 0] },
          currentMonthStatus: 1,
          paymentId: 1 // **THE FIX IS HERE: Make sure to include the paymentId in the final output.**
        }
      }
    ]).toArray();

    return NextResponse.json({ tenantStatuses });

  } catch (error) {
    console.error("Fetch Payment Status API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}