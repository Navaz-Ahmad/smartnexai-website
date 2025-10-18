import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import ExcelJS from 'exceljs';

const pgDbUri = process.env.MONGODB_URI_PG!;

// **THE FIX IS HERE: This file must contain a GET function.**
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId');
    const date = searchParams.get('date');
    const format = searchParams.get('format');

    if (!pgId || !date) {
      return NextResponse.json({ message: 'PG ID and date are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const selectedDate = new Date(date);
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const startOfNextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);

    const payments = await db.collection("pg_payments").aggregate([
      { $match: { 
          pgId: new ObjectId(pgId),
          paymentDate: { $gte: startOfMonth, $lt: startOfNextMonth }
      }},
      { $lookup: { from: "tenants", localField: "tenantId", foreignField: "_id", as: "tenantInfo" }},
      { $unwind: "$tenantInfo" },
      { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" }},
      { $unwind: "$roomInfo" },
      { $project: {
          _id: 0,
          Date: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
          Tenant: "$tenantInfo.name",
          Room: "$roomInfo.roomNumber",
          Amount: "$amount",
          TransactionID: "$razorpayPaymentId",
      }},
      { $sort: { Date: 1 } }
    ]).toArray();

    if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Payments');
        worksheet.columns = [
            { header: 'Date', key: 'Date', width: 15 },
            { header: 'Tenant', key: 'Tenant', width: 30 },
            { header: 'Room', key: 'Room', width: 15 },
            { header: 'Amount', key: 'Amount', width: 15, style: { numFmt: '"₹"#,##0.00' } },
            { header: 'Transaction ID', key: 'TransactionID', width: 40 },
        ];
        worksheet.getRow(1).font = { bold: true };
        worksheet.addRows(payments);
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return NextResponse.json({ file: base64 });
    }

    return NextResponse.json({ payments });

  } catch (error) {
    console.error("Export API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}