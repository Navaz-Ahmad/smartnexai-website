import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { hash } from 'bcryptjs'; // **THE FIX IS HERE: Import the hashing function**

const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE a new, unassigned Tenant ---
export async function POST(request: Request) {
  try {
    const { name, mobile, address, email, password, ownerId, pgId } = await request.json();
    
    if (!name || !mobile || !password || !ownerId || !pgId || !address) {
      return NextResponse.json({ message: 'All required fields must be provided.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();
    
    const existingTenant = await db.collection("tenants").findOne({ mobile });
    if (existingTenant) {
        return NextResponse.json({ message: 'A tenant with this mobile number already exists.' }, { status: 409 });
    }

    // **THE FIX IS HERE: Securely hash the password before saving**
    const hashedPassword = await hash(password, 12);

    const newTenant = { 
        name, 
        mobile, 
        address,
        email: email || null,
        password: hashedPassword, // Save the hashed password, not the plain text one
        ownerId: new ObjectId(ownerId),
        pgId: new ObjectId(pgId),
        roomId: null,
        createdAt: new Date() 
    };
    const result = await db.collection("tenants").insertOne(newTenant);

    return NextResponse.json({ message: 'Tenant created successfully!', tenantId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Create Tenant API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// --- The GET, PUT (for edits), and DELETE functions remain the same ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pgId = searchParams.get('pgId');
        if (!pgId) return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
        
        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        const tenants = await db.collection("tenants").find({ pgId: new ObjectId(pgId) }).toArray();
        return NextResponse.json({ tenants }, { status: 200 });
    } catch (error) {
        console.error("Fetch Tenants API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { tenantId, name, mobile, address } = await request.json();
        
        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        await db.collection("tenants").updateOne(
            { _id: new ObjectId(tenantId) },
            { $set: { name, mobile, address } }
        );

        return NextResponse.json({ message: 'Tenant updated successfully!' }, { status: 200 });
    } catch (error) {
        console.error("Update Tenant API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');
        if (!tenantId) return NextResponse.json({ message: 'Tenant ID is required.' }, { status: 400 });
        
        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        await db.collection("tenants").deleteOne({ _id: new ObjectId(tenantId) });
        return NextResponse.json({ message: 'Tenant removed successfully!' }, { status: 200 });
    } catch (error) {
        console.error("Delete Tenant API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}