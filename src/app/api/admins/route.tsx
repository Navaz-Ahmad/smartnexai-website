import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, productKey } = await request.json();

    // --- Basic Validation ---
    if (!name || !email || !password || !productKey) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    // 1. Check if the product exists
    const product = await db.collection("products").findOne({ productKey: productKey });
    if (!product) {
        return NextResponse.json({ message: 'Invalid product specified.' }, { status: 400 });
    }

    // 2. Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
        return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 422 });
    }
    
    // 3. Hash the password
    const hashedPassword = await hashPassword(password);

    // 4. Create the new user document
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'admin', // Set the role to 'admin'
      assignedProducts: [product._id], // Assign the ID of the product
      createdAt: new Date(),
    };

    // 5. Insert the new user
    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json({ message: 'Admin user created successfully!', userId: result.insertedId }, { status: 201 });

  } catch (error) {
    console.error("Create Admin API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
