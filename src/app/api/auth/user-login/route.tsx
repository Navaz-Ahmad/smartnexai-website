import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json({ message: 'Mobile number is required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("smartnexai_db");

    const tenant = await db.collection("tenants").findOne({ mobile });

    if (!tenant) {
      return NextResponse.json({ message: 'No account found with this mobile number.' }, { status: 404 });
    }

    const pg = await db.collection("pgs").findOne({ _id: new ObjectId(tenant.pgId) });

    if (!pg) {
      return NextResponse.json({ message: 'Assigned PG not found. Please contact your PG manager.' }, { status: 404 });
    }

    return NextResponse.json({
      tenant: {
        _id: tenant._id.toString(),
        name: tenant.name,
        mobile: tenant.mobile,
      },
      pg: {
        _id: pg._id.toString(),
        name: pg.name,
        address: pg.address,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Tenant Login API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}
