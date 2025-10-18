import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

const coreDbUri = process.env.MONGODB_URI_CORE!;

export async function POST(request: Request) {
  try {
    if (!coreDbUri) throw new Error("Missing Core DB URI");
    const { name, email, phone, password, productKey } = await request.json();
    if (!name || !email || !password || !productKey) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    const client = await connectToDatabase(coreDbUri);
    const db = client.db();
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'An admin with this email already exists.' }, { status: 409 });
    }
    const product = await db.collection("products").findOne({ productKey });
    if (!product) {
      return NextResponse.json({ message: 'Invalid product key provided.' }, { status: 400 });
    }
    const hashedPassword = await hash(password, 12);
    const newAdmin = { name, email, phone, password: hashedPassword, role: "admin", assignedProducts: [product._id], createdAt: new Date() };
    await db.collection("users").insertOne(newAdmin);
    return NextResponse.json({ message: 'Admin created successfully!' }, { status: 201 });
  } catch (error: unknown) { // **THE FIX: Use 'unknown' instead of 'any'**
    console.error("Create Admin API Error:", error);
    // Safely check the type before using the error message
    const message = error instanceof Error ? error.message : "An internal server error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    try {
        if (!coreDbUri) throw new Error("Missing Core DB URI");
        const { id, name, email, phone } = await request.json();
        if (!id || !name || !email) {
            return NextResponse.json({ message: 'Admin ID, name, and email are required.' }, { status: 400 });
        }
        const client = await connectToDatabase(coreDbUri);
        const db = client.db();
        const existingUserWithEmail = await db.collection("users").findOne({ email, _id: { $ne: new ObjectId(id) } });
        if (existingUserWithEmail) {
            return NextResponse.json({ message: 'This email is already in use by another account.' }, { status: 409 });
        }
        const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { name, email, phone } });
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Admin updated successfully!' }, { status: 200 });
    } catch (error: unknown) { // **THE FIX: Use 'unknown' instead of 'any'**
        console.error("Update Admin API Error:", error);
        const message = error instanceof Error ? error.message : "An internal server error occurred.";
        return NextResponse.json({ message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        if (!coreDbUri) throw new Error("Missing Core DB URI");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Admin ID is required.' }, { status: 400 });
        }
        const client = await connectToDatabase(coreDbUri);
        const db = client.db();
        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Admin removed successfully!' }, { status: 200 });
    } catch (error: unknown) { // **THE FIX: Use 'unknown' instead of 'any'**
        console.error("Delete Admin API Error:", error);
        const message = error instanceof Error ? error.message : "An internal server error occurred.";
        return NextResponse.json({ message }, { status: 500 });
    }
}