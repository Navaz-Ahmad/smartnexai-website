import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { MongoClient } from 'mongodb'; // Ensure MongoClient is imported

const PRODUCT_KEY = 'pg-management';

// Explicitly type clientPromise if needed
// (Assuming your db.ts exports: const clientPromise: Promise<MongoClient>)
export async function GET() {
  try {
    const client: MongoClient = await clientPromise; // Type added here
    const db = client.db("smartnexai_db");

    // 1. Find the product's ID from its key
    const product = await db.collection("products").findOne({ productKey: PRODUCT_KEY });
    if (!product) {
      return NextResponse.json({ message: `Product with key '${PRODUCT_KEY}' not found.` }, { status: 404 });
    }
    
    // 2. Find all users who have this product's ID in their 'assignedProducts' array
    const admins = await db.collection("users").find(
      { assignedProducts: product._id },
      { projection: { password: 0 } } // Exclude the password field
    ).toArray();

    return NextResponse.json({ admins });

  } catch (error: unknown) {
    console.error(`Fetch Admins API Error for ${PRODUCT_KEY}:`, error);
    let message = 'An internal server error occurred.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
