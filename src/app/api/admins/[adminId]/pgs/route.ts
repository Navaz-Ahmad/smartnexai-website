import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ adminId: string }> } // 👈 async params fix
): Promise<NextResponse> => {
  try {
    const { adminId } = await context.params; // 👈 await here

    if (!adminId) {
      return NextResponse.json({ message: "Admin ID is required." }, { status: 400 });
    }

    const pgDbUri = process.env.MONGODB_URI_PG;
    if (!pgDbUri) throw new Error("Missing MONGODB_URI_PG environment variable.");

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const pgsWithTenantCount = await db
      .collection("pgs")
      .aggregate([
        { $match: { ownerId: new ObjectId(adminId) } },
        {
          $lookup: {
            from: "tenants",
            localField: "_id",
            foreignField: "pgId",
            as: "tenants",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            address: 1,
            tenantCount: { $size: "$tenants" },
          },
        },
      ])
      .toArray();

    return NextResponse.json({ pgs: pgsWithTenantCount });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An internal server error occurred.";
    console.error("Fetch Admin PGs API Error:", message);
    return NextResponse.json({ message }, { status: 500 });
  }
};
