import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db'; // Import our new, flexible connector
import { ObjectId } from 'mongodb';

// Define the database URIs from your environment variables. This API needs both.
const coreDbUri = process.env.MONGODB_URI_CORE!;
const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE a new PG ---
export async function POST(request: Request) {
  try {
    const { name, address, ownerId } = await request.json();

    // Basic validation
    if (!name || !address || !ownerId) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // --- Step 1: Connect to the CORE database to validate the owner ---
    // This is a crucial security check to ensure only valid admins can create PGs.
    const coreClient = await connectToDatabase(coreDbUri);
    const coreDb = coreClient.db(); // Gets 'smartnexai_db' from the URI
    
    const owner = await coreDb.collection("users").findOne({ _id: new ObjectId(ownerId), role: 'admin' });
    if (!owner) {
        return NextResponse.json({ message: 'Invalid owner ID or user is not an admin.' }, { status: 403 });
    }

    // --- Step 2: Connect to the PG database to insert the new PG ---
    // Now that the owner is validated, we store the PG data in its own database.
    const pgClient = await connectToDatabase(pgDbUri);
    const pgDb = pgClient.db(); // Gets 'pg_management_db' from the URI

    const newPg = {
      name,
      address,
      ownerId: new ObjectId(ownerId), // Store the user's ID for cross-database reference
      createdAt: new Date(),
    };
    
    // The 'pgs' collection will be created automatically in the 'pg_management_db'
    await pgDb.collection("pgs").insertOne(newPg);

    return NextResponse.json({ message: 'PG created successfully!' }, { status: 201 });

  } catch (error) {
    console.error("Create PG API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// --- Function to GET all PGs for a specific Admin ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get('ownerId');

        if (!ownerId) {
            return NextResponse.json({ message: 'Owner ID is required.' }, { status: 400 });
        }

        // --- Connect to the PG database to fetch PGs ---
        // This operation only needs to read PG data, so we only connect to the PG database.
        const pgClient = await connectToDatabase(pgDbUri);
        const pgDb = pgClient.db(); // Gets 'pg_management_db' from the URI

        // Find all documents in the 'pgs' collection that match the ownerId
        const pgs = await pgDb.collection("pgs").find({ ownerId: new ObjectId(ownerId) }).toArray();

        return NextResponse.json({ pgs }, { status: 200 });

    } catch (error) {
        console.error("Fetch PGs API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}