import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
// We'll need a way to get the current user's session later.
// For now, this is a placeholder. In a real app, you'd use a library like NextAuth.js
// For this example, we will simulate the user role.

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    // --- IMPORTANT SIMULATION ---
    // In a real application, you would get the user's session from the request headers/cookies.
    // For now, we will assume a superadmin is logged in to demonstrate functionality.
    // Replace this with your actual session management logic.
    const userRole = 'superadmin'; // SIMULATED: Can be 'superadmin' or 'admin'
    // const userId = 'some_user_id_from_session';

    let products = [];

    if (userRole === 'superadmin') {
      // Superadmin gets all active products
      products = await db.collection("products").find({ isActive: true }).toArray();
    } else {
      // A regular admin gets only their assigned products
      // This part requires a full user session to work correctly.
      // const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      // if (user && user.assignedProducts) {
      //   products = await db.collection("products").find({ _id: { $in: user.assignedProducts }, isActive: true }).toArray();
      // }
      
      // For now, let's return all products for admins as well for demonstration.
      products = await db.collection("products").find({ isActive: true }).toArray();
    }

    return NextResponse.json({ products });

  } catch (error) {
    console.error("API Error fetching products:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}