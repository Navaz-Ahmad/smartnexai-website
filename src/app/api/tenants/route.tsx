import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

// Function to CREATE a new Tenant
export async function POST(request: Request) {
  try {
    const { name, mobile, address, pgId } = await request.json();
    if (!name || !mobile || !address || !pgId) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smartnexai_db");
    
    const existingTenant = await db.collection("tenants").findOne({ mobile });
    if (existingTenant) {
        return NextResponse.json({ message: 'A tenant with this mobile number already exists.' }, { status: 409 });
    }

    const newTenant = { name, mobile, address, pgId: new ObjectId(pgId), createdAt: new Date() };
    await db.collection("tenants").insertOne(newTenant);
    return NextResponse.json({ message: 'Tenant created successfully!' }, { status: 201 });
  } catch (error) {
    console.error("Create Tenant API Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

// Function to GET all Tenants for a specific PG
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pgId = searchParams.get('pgId');
        if (!pgId) return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("smartnexai_db");
        const tenants = await db.collection("tenants").find({ pgId: new ObjectId(pgId) }).toArray();
        return NextResponse.json({ tenants }, { status: 200 });
    } catch (error) {
        console.error("Fetch Tenants API Error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}

// Function to UPDATE an existing Tenant
export async function PUT(request: Request) {
    try {
        const { tenantId, name, mobile, address } = await request.json();
        if (!tenantId || !name || !mobile || !address) {
            return NextResponse.json({ message: 'Missing required fields for update.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("smartnexai_db");

        // Optional: Check if the new mobile number is already taken by another tenant
        const existingTenant = await db.collection("tenants").findOne({ mobile, _id: { $ne: new ObjectId(tenantId) } });
        if (existingTenant) {
            return NextResponse.json({ message: 'This mobile number is already in use by another tenant.' }, { status: 409 });
        }

        const result = await db.collection("tenants").updateOne(
            { _id: new ObjectId(tenantId) },
            { $set: { name, mobile, address } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Tenant not found.' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Tenant updated successfully!' }, { status: 200 });
    } catch (error) {
        console.error("Update Tenant API Error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}

// Function to DELETE a Tenant
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');
        if (!tenantId) return NextResponse.json({ message: 'Tenant ID is required.' }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("smartnexai_db");

        const result = await db.collection("tenants").deleteOne({ _id: new ObjectId(tenantId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Tenant not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Tenant removed successfully!' }, { status: 200 });
    } catch (error) {
        console.error("Delete Tenant API Error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}

