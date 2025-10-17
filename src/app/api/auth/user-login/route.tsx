import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { compare } from 'bcryptjs';
// **THE FIX IS HERE: The unused 'ObjectId' import has been removed.**

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function POST(request: Request) {
  try {
    const { mobile, password } = await request.json();

    if (!mobile || !password) {
      return NextResponse.json({ message: 'Mobile number and password are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const tenant = await db.collection("tenants").findOne({ mobile });
    if (!tenant) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const passwordsMatch = await compare(password, tenant.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }
    
    const userSession = {
        _id: tenant._id.toString(),
        name: tenant.name,
        email: tenant.email,
        mobile: tenant.mobile,
        role: 'tenant',
        pgId: tenant.pgId?.toString(),
        roomId: tenant.roomId?.toString(),
    };

    return NextResponse.json({ message: "Login successful!", user: userSession }, { status: 200 });

  } catch (error) {
    console.error("Tenant Login API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}