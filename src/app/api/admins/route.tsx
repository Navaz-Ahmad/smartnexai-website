import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

// Function to CREATE a new Admin
export async function POST(request: Request) {
  try {
    const { name, email, phone, password, productKey } = await request.json();

    if (!name || !email || !password || !productKey) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'An admin with this email already exists.' }, { status: 409 });
    }

    // Find the product to get its ID
    const product = await db.collection("products").findOne({ productKey });
    if (!product) {
      return NextResponse.json({ message: 'Invalid product key provided.' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const newAdmin = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      assignedProducts: [product._id], // Assign the product's ObjectId
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newAdmin);
    return NextResponse.json({ message: 'Admin created successfully!' }, { status: 201 });

  } catch (error) {
    console.error("Create Admin API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// Function to UPDATE an existing Admin
export async function PUT(request: Request) {
    try {
        const { id, name, email, phone } = await request.json();

        if (!id || !name || !email) {
            return NextResponse.json({ message: 'Admin ID, name, and email are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("smartnexai_db");

        // Check if another user already has the new email
        const existingUserWithEmail = await db.collection("users").findOne({ email, _id: { $ne: new ObjectId(id) } });
        if (existingUserWithEmail) {
            return NextResponse.json({ message: 'This email is already in use by another account.' }, { status: 409 });
        }

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, email, phone } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin updated successfully!' }, { status: 200 });

    } catch (error) {
        console.error("Update Admin API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

// Function to DELETE an Admin
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        
        if (!id) {
            return NextResponse.json({ message: 'Admin ID is required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("smartnexai_db");

        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin removed successfully!' }, { status: 200 });

    } catch (error) {
        console.error("Delete Admin API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

