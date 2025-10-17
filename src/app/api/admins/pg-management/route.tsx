import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db'; // Import our new, flexible connector

// This API route's purpose is to find users, so it only needs to talk to the core database.
const coreDbUri = process.env.MONGODB_URI_CORE!;
const PRODUCT_KEY = 'pg-management';

export async function GET() {
  try {
    // Step 1: Specifically connect to the CORE database.
    const client = await connectToDatabase(coreDbUri);
    const db = client.db(); // This gets the 'smartnexai_db' from the URI

    // Step 2: Find the product's ID from its key within the 'products' collection.
    const product = await db.collection("products").findOne({ productKey: PRODUCT_KEY });
    if (!product) {
      return NextResponse.json({ message: `Product with key '${PRODUCT_KEY}' not found.` }, { status: 404 });
    }
    
    const assignedProductId = product._id;

    // Step 3: Find all users in the 'users' collection who are assigned to this product.
    const admins = await db.collection("users").find(
      { assignedProducts: assignedProductId },
      { projection: { password: 0 } } // Exclude the password for security
    ).toArray();

    return NextResponse.json({ admins });

  } catch (error: unknown) {
    console.error(`Fetch Admins API Error for ${PRODUCT_KEY}:`, error);
    let message = 'An internal server error occurred.';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}