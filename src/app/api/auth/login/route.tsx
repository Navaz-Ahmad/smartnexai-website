import { NextResponse } from 'next/server';
import { ObjectId, MongoClient } from 'mongodb';
import { verifyPassword } from '@/lib/auth';
import * as dbModule from '@/lib/db'; // Import all exports to type the client

// Type the MongoDB client promise to remove implicit 'any'
const clientPromise: Promise<MongoClient> = dbModule.default as Promise<MongoClient>;

// --- TypeScript interfaces for better type safety ---
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  assignedProducts: (ObjectId | string)[];
}

interface UserSession {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  productKey?: string; // optional, only for admins
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    // Fetch the user and cast to User interface
    const user = await db.collection<User>("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const passwordsMatch = await verifyPassword(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const userSession: UserSession = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Fetch productKey if admin has assigned products
    if (user.role === 'admin' && user.assignedProducts?.length > 0) {
      const firstProductId = typeof user.assignedProducts[0] === 'string'
        ? new ObjectId(user.assignedProducts[0])
        : user.assignedProducts[0];

      const product = await db.collection("products").findOne({ _id: firstProductId });
      if (product) {
        userSession.productKey = product.productKey;
      }
    }

    return NextResponse.json({ message: "Login successful!", user: userSession }, { status: 200 });

  } catch (error: unknown) {
    console.error("Login API error:", error);
    let message = "An internal server error occurred.";
    if (error instanceof Error) message = error.message;

    return NextResponse.json({ message }, { status: 500 });
  }
}
