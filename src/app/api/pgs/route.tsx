import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

// Function to CREATE a new PG
export async function POST(request: Request) {
  try {
    const { name, address, ownerId } = await request.json();

    if (!name || !address || !ownerId) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    const newPg = {
      name,
      address,
      ownerId: new ObjectId(ownerId),
      createdAt: new Date(),
    };

    await db.collection("pgs").insertOne(newPg);

    return NextResponse.json({ message: 'PG created successfully!', pg: newPg }, { status: 201 });

  } catch (error) {
    console.error("Create PG API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// Function to GET all PGs for a specific owner
export async function GET(request: NextRequest) {
    try {
        // We use NextRequest to easily access URL search parameters
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get('ownerId');

        if (!ownerId) {
            return NextResponse.json({ message: 'Owner ID is required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("smartnexai_db");

        // Find all documents in the 'pgs' collection that match the ownerId
        const pgs = await db.collection("pgs").find({ ownerId: new ObjectId(ownerId) }).toArray();

        return NextResponse.json({ pgs }, { status: 200 });

    } catch (error) {
        console.error("Fetch PGs API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

