import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE a new Ticket (No changes) ---
export async function POST(request: Request) {
  try {
    const { tenantId, pgId, roomId, description } = await request.json();
    if (!tenantId || !pgId || !roomId || !description) {
      return NextResponse.json({ message: 'Missing required information.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();
    const newTicket = {
      tenantId: new ObjectId(tenantId),
      pgId: new ObjectId(pgId),
      roomId: new ObjectId(roomId),
      description,
      status: 'open',
      createdAt: new Date(),
    };
    await db.collection("pg_tickets").insertOne(newTicket);
    return NextResponse.json({ message: 'Ticket submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error("Create Ticket API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// --- NEW: Function to GET all Tickets for an Admin ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get('ownerId');
        if (!ownerId) {
            return NextResponse.json({ message: 'Owner ID is required.' }, { status: 400 });
        }

        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        // Use Aggregation to join multiple collections and get all necessary data
        const tickets = await db.collection("pg_tickets").aggregate([
            // 1. Join with PGs to filter by owner
            { $lookup: { from: "pgs", localField: "pgId", foreignField: "_id", as: "pgInfo" } },
            { $unwind: "$pgInfo" },
            // 2. Match only tickets belonging to the logged-in admin
            { $match: { "pgInfo.ownerId": new ObjectId(ownerId) } },
            // 3. Join with Tenants to get tenant name
            { $lookup: { from: "tenants", localField: "tenantId", foreignField: "_id", as: "tenantInfo" } },
            { $unwind: "$tenantInfo" },
            // 4. Join with Rooms to get room number
            { $lookup: { from: "pg_rooms", localField: "roomId", foreignField: "_id", as: "roomInfo" } },
            { $unwind: "$roomInfo" },
            // 5. Reshape the data for a clean output
            {
                $project: {
                    _id: 1,
                    description: 1,
                    status: 1,
                    createdAt: 1,
                    tenantName: "$tenantInfo.name",
                    pgName: "$pgInfo.name",
                    roomNumber: "$roomInfo.roomNumber"
                }
            },
            // 6. Sort by newest first
            { $sort: { createdAt: -1 } }
        ]).toArray();

        return NextResponse.json({ tickets });

    } catch (error) {
        console.error("Fetch Tickets API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

// --- NEW: Function to UPDATE a Ticket's Status ---
export async function PUT(request: Request) {
    try {
        const { ticketId, status } = await request.json();
        if (!ticketId || !status) {
            return NextResponse.json({ message: 'Ticket ID and new status are required.' }, { status: 400 });
        }

        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        const result = await db.collection("pg_tickets").updateOne(
            { _id: new ObjectId(ticketId) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Ticket not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Ticket status updated successfully!' }, { status: 200 });

    } catch (error) {
        console.error("Update Ticket API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}