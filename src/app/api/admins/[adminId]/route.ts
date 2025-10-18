import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// ✅ Use env variable safely
const coreDbUri = process.env.MONGODB_URI_CORE;

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ adminId: string }> } // ✅ FIXED for Next.js 15
): Promise<NextResponse> => {
  try {
    const { adminId } = await context.params; // ✅ Await Promise

    if (!adminId) {
      return NextResponse.json({ message: "Admin ID is required." }, { status: 400 });
    }

    if (!coreDbUri) {
      throw new Error("Missing MONGODB_URI_CORE environment variable.");
    }

    const client = await connectToDatabase(coreDbUri);
    const db = client.db();

    const admin = await db.collection("users").findOne(
      { _id: new ObjectId(adminId) },
      { projection: { name: 1, email: 1, phone: 1, _id: 0 } }
    );

    if (!admin) {
      return NextResponse.json({ message: "Admin not found." }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An internal server error occurred.";
    console.error("Fetch Admin Details API Error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
};
