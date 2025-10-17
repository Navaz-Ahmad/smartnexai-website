import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId');
    if (!pgId) {
      return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    const tenantStatuses = await db.collection("tenants").aggregate([
      { $match: { pgId: new ObjectId(pgId), roomId: { $ne: null } } },
      { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" } },
      { $unwind: "$roomInfo" },
      { $lookup: { from: "pg_payments", localField: "_id", foreignField: "tenantId", as: "payments" } },
      {
        $addFields: {
          rent: "$roomInfo.rent",
          monthsSinceJoining: { $max: [1, { $add: [ { $subtract: [currentMonth, { $month: "$createdAt" }] }, { $multiply: [12, { $subtract: [currentYear, { $year: "$createdAt" }] }] }, 1 ]}] },
          totalPaid: { $sum: "$payments.amount" },
          paidThisMonth: { $sum: { $map: { input: { $filter: { input: "$payments", as: "payment", cond: { $gte: ["$$payment.paymentDate", startOfMonth] } } }, as: "p", in: "$$p.amount" } } }
        }
      },
      { $addFields: { totalRentDue: { $multiply: ["$rent", "$monthsSinceJoining"] } } },
      { $addFields: { totalDueAmount: { $subtract: ["$totalRentDue", "$totalPaid"] } } },
      {
        $addFields: {
          currentMonthStatus: {
            $switch: {
              branches: [
                { case: { $gte: ["$paidThisMonth", "$rent"] }, then: "Paid" },
                { case: { $and: [ { $gt: ["$paidThisMonth", 0] }, { $lt: ["$paidThisMonth", "$rent"] } ] }, then: "Partially Paid" },
              ],
              default: "Unpaid"
            }
          }
        }
      },
      {
        $project: {
          _id: 1, name: 1, mobile: 1, roomNumber: "$roomInfo.roomNumber",
          // **THE FIX IS HERE: Use $ifNull to guarantee a number is always returned.**
          // If totalDueAmount is null or doesn't exist (e.g., rent is null), this will return 0 instead.
          totalDueAmount: { $ifNull: ["$totalDueAmount", 0] },
          currentMonthStatus: 1
        }
      }
    ]).toArray();

    return NextResponse.json({ tenantStatuses });

  } catch (error) {
    console.error("Fetch Payment Status API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}