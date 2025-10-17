import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

// All operations in this file use the PG Management database.
const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE a new Floor ---
export async function POST(request: Request) {
  try {
    const { pgId, floorNumber } = await request.json();

    if (!pgId || floorNumber === undefined) {
      return NextResponse.json({ message: 'PG ID and Floor Number are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    // Check if a floor with this number already exists for this PG
    const existingFloor = await db.collection("pg_floors").findOne({ pgId: new ObjectId(pgId), floorNumber });
    if (existingFloor) {
      return NextResponse.json({ message: `Floor ${floorNumber} already exists for this PG.` }, { status: 409 });
    }

    const newFloor = {
      pgId: new ObjectId(pgId),
      floorNumber: Number(floorNumber),
      createdAt: new Date(),
    };

    // If 'pg_floors' collection doesn't exist, MongoDB creates it on this insert operation.
    await db.collection("pg_floors").insertOne(newFloor);

    return NextResponse.json({ message: `Floor ${floorNumber} added successfully!` }, { status: 201 });
  } catch (error) {
    console.error("Create Floor API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// --- Function to GET all Floors for a specific PG ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pgId = searchParams.get('pgId');

        if (!pgId) {
            return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
        }

        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        const floors = await db.collection("pg_floors").find({ pgId: new ObjectId(pgId) }).toArray();

        return NextResponse.json({ floors }, { status: 200 });
    } catch (error) {
        console.error("Fetch Floors API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}