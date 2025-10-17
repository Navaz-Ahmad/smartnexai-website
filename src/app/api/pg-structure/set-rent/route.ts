import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function updates the 'rent' field for a specific room.
export async function PUT(request: Request) {
  try {
    const { roomId, rent } = await request.json();

    if (!roomId || rent === undefined) {
      return NextResponse.json({ message: 'Room ID and rent amount are required.' }, { status: 400 });
    }
    if (typeof rent !== 'number' || rent < 0) {
        return NextResponse.json({ message: 'Invalid rent amount.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const result = await db.collection("pg_rooms").updateOne(
      { _id: new ObjectId(roomId) },
      { $set: { rent: rent } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Room not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Rent updated successfully!' });

  } catch (error) {
    console.error("Set Rent API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}