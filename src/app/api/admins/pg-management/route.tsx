import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

const PRODUCT_KEY = 'pg-management';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    // 1. Find the product's ID from its key
    const product = await db.collection("products").findOne({ productKey: PRODUCT_KEY });
    if (!product) {
      return NextResponse.json({ message: `Product with key '${PRODUCT_KEY}' not found.` }, { status: 404 });
    }
    
    // 2. Find all users who have this product's ID in their 'assignedProducts' array
    const admins = await db.collection("users").find(
      { assignedProducts: product._id },
      { projection: { password: 0 } } // Exclude the password field from the result
    ).toArray();

    return NextResponse.json({ admins });

  } catch (error) {
    console.error(`Fetch Admins API Error for ${PRODUCT_KEY}:`, error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
