import { NextResponse } from 'next/server'; // **THE FIX: The unused 'NextRequest' has been removed**
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function POST(request: Request) {
  try {
    const { tenantId, roomId, pgId, rent } = await request.json();

    if (!tenantId || !roomId || !pgId || rent === undefined) {
      return NextResponse.json({ message: 'All assignment details are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const tenantUpdateResult = await db.collection("tenants").updateOne(
      { _id: new ObjectId(tenantId) },
      { $set: { roomId: new ObjectId(roomId), pgId: new ObjectId(pgId) } }
    );

    if (tenantUpdateResult.matchedCount === 0) {
        return NextResponse.json({ message: 'Tenant not found.' }, { status: 404 });
    }

    const newAssignment = {
        tenantId: new ObjectId(tenantId),
        roomId: new ObjectId(roomId),
        pgId: new ObjectId(pgId),
        rent: Number(rent),
        startDate: new Date(),
        isActive: true,
    };

    await db.collection("pg_assignments").insertOne(newAssignment);

    return NextResponse.json({ message: 'Assignment created successfully!' });

  } catch (error) {
    console.error("Create Assignment API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

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

    await db.collection("pg_assignments").updateMany(
      { tenantId: tenantObjectId, isActive: true },
      { $set: { isActive: false, endDate: new Date() } }
    );

    const newAssignment = {
        tenantId: tenantObjectId,
        roomId: newRoomObjectId,
        pgId: newPgObjectId,
        rent: Number(newRent),
        startDate: new Date(),
        isActive: true,
    };
    await db.collection("pg_assignments").insertOne(newAssignment);

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