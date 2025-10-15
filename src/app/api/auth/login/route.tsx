import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// --- Define a proper TypeScript type for the session object ---
interface UserSession {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  productKey?: string; // optional, only for admins with products
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    const user = await db.collection("users").findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const passwordsMatch = await verifyPassword(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Create the session object using the interface
    const userSession: UserSession = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // --- ✨ NEW LOGIC: Fetch productKey for Admins ---
    if (user.role === 'admin' && user.assignedProducts && user.assignedProducts.length > 0) {
      const firstProductId = user.assignedProducts[0];
      const product = await db.collection("products").findOne({ _id: new ObjectId(firstProductId) });

      if (product) {
        userSession.productKey = product.productKey;
      }
    }
    // --- End of New Logic ---

    return NextResponse.json(
      { message: "Login successful!", user: userSession },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
