import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId'); // Now we expect pgId

    if (!pgId) {
      return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    // **THE NEW LOGIC: Find unassigned tenants for a SPECIFIC PG.**
    const tenants = await db.collection("tenants").find({
      pgId: new ObjectId(pgId),
      roomId: null
    }).project({ name: 1, mobile: 1 }).toArray();

    return NextResponse.json({ tenants });

  } catch (error) {
    console.error("Fetch Unassigned Tenants API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}