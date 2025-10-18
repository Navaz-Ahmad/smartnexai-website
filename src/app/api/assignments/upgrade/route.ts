import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function handles moving a tenant to a new room.
export async function PUT(request: Request) {
  try {
    const { tenantId, newRoomId, newPgId, newRent } = await request.json();

    if (!tenantId || !newRoomId || !newPgId || newRent === undefined) {
      return NextResponse.json({ message: 'All upgrade details are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const tenantObjectId = new ObjectId(tenantId);
    const newRoomObjectId = new ObjectId(newRoomId);
    const newPgObjectId = new ObjectId(newPgId);

    // --- Step 1: Deactivate the tenant's current active assignment (if one exists) ---
    // This preserves a historical record of their past rooms and rents.
    await db.collection("pg_assignments").updateMany(
      { tenantId: tenantObjectId, isActive: true },
      { $set: { isActive: false, endDate: new Date() } }
    );

    // --- Step 2: Create a new, active assignment for the new room ---
    const newAssignment = {
        tenantId: tenantObjectId,
        roomId: newRoomObjectId,
        pgId: newPgObjectId,
        rent: Number(newRent),
        startDate: new Date(),
        isActive: true,
    };
    await db.collection("pg_assignments").insertOne(newAssignment);

    // --- Step 3: Update the primary tenant document with the new room and PG ---
    // This keeps the main record up-to-date for quick lookups.
    await db.collection("tenants").updateOne(
      { _id: tenantObjectId },
      { $set: { roomId: newRoomObjectId, pgId: newPgObjectId } }
    );

    return NextResponse.json({ message: 'Room upgrade successful!' });

  } catch (error) {
    console.error("Room Upgrade API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}