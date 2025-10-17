import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db'; // Import our new, flexible connector

// This API route handles user authentication, which is a core function.
// It will only ever need to connect to the core database.
const coreDbUri = process.env.MONGODB_URI_CORE!;

// --- TypeScript interfaces for better type safety ---
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  assignedProducts: ObjectId[]; // Assuming these are always ObjectIds in the DB
}

interface UserSession {
  _id: string; // Send as string to the client
  name: string;
  email: string;
  role: string;
  productKey?: string; // Optional, only for admins
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password.' }, { status: 400 });
    }

    // --- Step 1: Connect specifically to the CORE database ---
    const client = await connectToDatabase(coreDbUri);
    const db = client.db(); // This gets the 'smartnexai_db' from the URI

    // --- Step 2: Find the user in the 'users' collection ---
    const user = await db.collection<User>("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // --- Step 3: Verify the password ---
    const passwordsMatch = await verifyPassword(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // --- Step 4: Prepare the user session object to send to the client ---
    const userSession: UserSession = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // --- Step 5: If the user is an admin, find their assigned product's key ---
    if (user.role === 'admin' && user.assignedProducts?.length > 0) {
      // Find the product in the 'products' collection using the first assigned ID
      const product = await db.collection("products").findOne({ _id: user.assignedProducts[0] });
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