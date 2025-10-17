import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

// All operations in this file use the PG Management database.
const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE a new Room ---
export async function POST(request: Request) {
  try {
    const { pgId, floorId, roomNumber, capacity } = await request.json();

    if (!pgId || !floorId || !roomNumber || capacity === undefined) {
      return NextResponse.json({ message: 'PG ID, Floor ID, Room Number, and Capacity are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    // Check if a room with this number already exists for this floor
    const existingRoom = await db.collection("pg_rooms").findOne({ floorId: new ObjectId(floorId), roomNumber });
    if (existingRoom) {
      return NextResponse.json({ message: `Room ${roomNumber} already exists on this floor.` }, { status: 409 });
    }

    const newRoom = {
      pgId: new ObjectId(pgId),
      floorId: new ObjectId(floorId),
      roomNumber: roomNumber.toString(),
      capacity: Number(capacity),
      createdAt: new Date(),
    };

    // If 'pg_rooms' collection doesn't exist, MongoDB creates it here.
    await db.collection("pg_rooms").insertOne(newRoom);

    return NextResponse.json({ message: `Room ${roomNumber} added successfully!` }, { status: 201 });
  } catch (error) {
    console.error("Create Room API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// --- Function to GET all Rooms for a specific Floor ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const floorId = searchParams.get('floorId');

        if (!floorId) {
            return NextResponse.json({ message: 'Floor ID is required.' }, { status: 400 });
        }

        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        const rooms = await db.collection("pg_rooms").find({ floorId: new ObjectId(floorId) }).toArray();

        return NextResponse.json({ rooms }, { status: 200 });
    } catch (error) {
        console.error("Fetch Rooms API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}