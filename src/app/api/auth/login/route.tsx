import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { ObjectId } from 'mongodb';

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

    // Prepare the basic user session object, excluding the password
    const userSession: { [key: string]: any } = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // --- ✨ NEW LOGIC: Fetch productKey for Admins ---
    // If the user is an admin and has products assigned...
    if (user.role === 'admin' && user.assignedProducts && user.assignedProducts.length > 0) {
      // Get the first assigned product's ID
      const firstProductId = user.assignedProducts[0];
      
      // Find that product in the 'products' collection
      const product = await db.collection("products").findOne({ _id: new ObjectId(firstProductId) });

      // If the product is found, add its key to the session object
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
