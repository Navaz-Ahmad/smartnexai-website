import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();
    if (!mobile) {
      return NextResponse.json({ message: 'Mobile number is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const tenant = await db.collection("tenants").findOne({ mobile });

    if (!tenant) {
      return NextResponse.json({ message: 'No account found with this mobile number.' }, { status: 404 });
    }

    // If tenant is found, just return a success status
    return NextResponse.json({ message: 'Mobile number verified.' }, { status: 200 });

  } catch (error) {
    console.error("Tenant Mobile Check API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}