import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function now assigns a tenant to a room AND links them to the correct PG.
export async function PUT(request: Request) {
  try {
    // Now expecting pgId to be sent from the frontend
    const { tenantId, roomId, pgId } = await request.json(); 

    if (!tenantId || !roomId || !pgId) {
      return NextResponse.json({ message: 'Tenant ID, Room ID, and PG ID are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    // **THE FIX IS HERE:**
    // We now update both the roomId and the pgId in a single, atomic operation.
    // This guarantees the tenant is always correctly linked.
    const result = await db.collection("tenants").updateOne(
      { _id: new ObjectId(tenantId) },
      { 
        $set: { 
          roomId: new ObjectId(roomId),
          pgId: new ObjectId(pgId) 
        } 
      }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Tenant not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tenant assigned successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Assign Tenant API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}