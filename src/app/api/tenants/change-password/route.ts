import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { compare, hash } from 'bcryptjs';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function PUT(request: Request) {
  try {
    const { tenantId, currentPassword, newPassword } = await request.json();

    if (!tenantId || !currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(tenantId) });
    if (!tenant) {
      return NextResponse.json({ message: 'Tenant account not found.' }, { status: 404 });
    }

    // Verify that the current password is correct
    const passwordsMatch = await compare(currentPassword, tenant.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: 'Incorrect current password.' }, { status: 403 }); // 403 Forbidden
    }

    // Hash the new password before saving it
    const hashedNewPassword = await hash(newPassword, 12);

    // Update the database with the new hashed password
    await db.collection("tenants").updateOne(
      { _id: new ObjectId(tenantId) },
      { $set: { password: hashedNewPassword } }
    );

    return NextResponse.json({ message: 'Password updated successfully!' }, { status: 200 });

  } catch (error) {
    console.error("Change Password API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}