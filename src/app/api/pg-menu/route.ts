import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// --- Function to CREATE or UPDATE the Menu for a PG ---
export async function POST(request: Request) {
  try {
    const { pgId, breakfast, lunch, dinner } = await request.json();

    if (!pgId || !breakfast || !lunch || !dinner) {
      return NextResponse.json({ message: 'PG ID and all meal details are required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();
    
    // The menu is for today. We'll use a date string as a unique identifier.
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    const menuData = {
      pgId: new ObjectId(pgId),
      date: today,
      breakfast,
      lunch,
      dinner,
      lastUpdatedAt: new Date(),
    };

    // Use findOneAndUpdate with upsert:true. This will create a new menu if one for today
    // doesn't exist, or update the existing one if the admin makes changes.
    await db.collection("pg_menus").findOneAndUpdate(
      { pgId: new ObjectId(pgId), date: today },
      { $set: menuData },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Menu updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Update Menu API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}

// --- Function to GET the Menu for a specific PG ---
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pgId = searchParams.get('pgId');
        if (!pgId) {
            return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
        }

        const client = await connectToDatabase(pgDbUri);
        const db = client.db();

        const today = new Date().toISOString().split('T')[0];
        const menu = await db.collection("pg_menus").findOne({ pgId: new ObjectId(pgId), date: today });

        if (!menu) {
            return NextResponse.json({ message: "Today's menu has not been set yet." }, { status: 404 });
        }

        return NextResponse.json({ menu });
    } catch (error) {
        console.error("Fetch Menu API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}