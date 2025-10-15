import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb'; // Ensure MongoClient is imported
import * as dbModule from '@/lib/db'; // New: Import all exports as a module object

const PRODUCT_KEY = 'pg-management';

// **FIX: Bypassing implicit 'any' error (TS7030) and respecting no-require-imports**
// We use a namespace import (dbModule) and explicitly cast its default export
// to the expected Promise<MongoClient> type. This satisfies both TypeScript and ESLint.
const clientPromise: Promise<MongoClient> = dbModule.default as Promise<MongoClient>;

export async function GET() {
  try {
    // Await the correctly typed promise
    const client: MongoClient = await clientPromise;
    const db = client.db("smartnexai_db");

    // 1. Find the product's ID from its key
    const product = await db.collection("products").findOne({ productKey: PRODUCT_KEY });
    if (!product) {
      return NextResponse.json({ message: `Product with key '${PRODUCT_KEY}' not found.` }, { status: 404 });
    }
    
    // Use the retrieved product ID for the lookup
    // Assuming product is not null here due to the check above
    const assignedProductId = product._id;

    // 2. Find all users who have this product's ID in their 'assignedProducts' array
    // Note: assignedProducts is expected to contain ObjectId references.
    const admins = await db.collection("users").find(
      { assignedProducts: assignedProductId },
      { projection: { password: 0 } } // Exclude the password field for security
    ).toArray();

    return NextResponse.json({ admins });

  } catch (error: unknown) {
    console.error(`Fetch Admins API Error for ${PRODUCT_KEY}:`, error);
    let message = 'An internal server error occurred.';
    // Gracefully handle potential errors by providing the error message if it's an Error instance
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
