import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

// This API fetches product info from the core database.
const coreDbUri = process.env.MONGODB_URI_CORE!;

// **THE FIX PART 1: Define the shape of a Product object.**
// This provides the "label" for our box, telling TypeScript exactly what a Product is.
interface Product {
  _id: ObjectId;
  productName: string;
  productKey: string;
  description: string;
  accessUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    if (!coreDbUri) {
        throw new Error("Missing MONGODB_URI_CORE environment variable.");
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json({ message: 'User ID and role are required.' }, { status: 400 });
    }

    // Connect specifically to the CORE database
    const client = await connectToDatabase(coreDbUri);
    const db = client.db(); // Gets 'smartnexai_db'

    // **THE FIX PART 2: Apply our new 'Product' type to the variable.**
    // This tells TypeScript that this will be an array of Product objects.
    let products: Product[] = [];

    if (role === 'superadmin') {
      // Superadmin gets to see all active products
      // We also tell the collection method to expect Product objects.
      products = await db.collection<Product>("products").find({ isActive: true }).toArray();
    } else if (role === 'admin') {
      // A regular admin gets only their assigned products
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      
      if (user && user.assignedProducts && user.assignedProducts.length > 0) {
        // Find all products whose _id is in the user's assignedProducts array
        products = await db.collection<Product>("products").find({
          _id: { $in: user.assignedProducts },
          isActive: true
        }).toArray();
      }
    }

    return NextResponse.json({ products });

  } catch (error) {
    console.error("API Error fetching products:", error);
    const message = error instanceof Error ? error.message : "An internal server error occurred.";
    return NextResponse.json({ message }, { status: 500 });
  }
}