import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { hash } from 'bcryptjs';

const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE a new, unassigned Tenant ---
export async function POST(request: Request) {
  try {
    // **NEW: Now expecting photoBase64**
    const { name, mobile, email, password, ownerId, photoBase64 } = await request.json();
    
    if (!name || !mobile || !password || !ownerId) {
      return NextResponse.json({ message: 'Name, mobile, password, and ownerId are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();
    
    const existingTenant = await db.collection("tenants").findOne({ mobile });
    if (existingTenant) {
        return NextResponse.json({ message: 'A tenant with this mobile number already exists.' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);

    const newTenant = { 
        name, 
        mobile,
        email: email || null,
        password: hashedPassword,
        ownerId: new ObjectId(ownerId),
        // **NEW: Save the Base64 image string to the database**
        // Note: For very large files, storing URLs from a cloud service like S3 is better,
        // but for profile photos, Base64 in MongoDB is acceptable.
        photoBase64: photoBase64 || null,
        pgId: null,
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