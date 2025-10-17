import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function fetches a single PG and its fully nested structure of floors, rooms, and tenants.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId');

    if (!pgId) {
      return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    // Use a complex aggregation pipeline to join all related data
    const pgData = await db.collection("pgs").aggregate([
      // 1. Find the specific PG we want
      { $match: { _id: new ObjectId(pgId) } },
      
      // 2. Look up all floors belonging to this PG
      { $lookup: { from: "pg_floors", localField: "_id", foreignField: "pgId", as: "floors" } },
      
      // 3. Look up all rooms belonging to this PG
      { $lookup: { from: "pg_rooms", localField: "_id", foreignField: "pgId", as: "all_rooms" } },
      
      // 4. Look up all tenants belonging to this PG
      { $lookup: { from: "tenants", localField: "_id", foreignField: "pgId", as: "all_tenants" } },
      
      // 5. Reshape the data to nest rooms and tenants correctly
      {
        $addFields: {
          floors: {
            $map: {
              input: "$floors",
              as: "floor",
              in: {
                $mergeObjects: [
                  "$$floor",
                  {
                    rooms: {
                      $map: {
                        input: { $filter: { input: "$all_rooms", as: "room", cond: { $eq: ["$$room.floorId", "$$floor._id"] } } },
                        as: "room_info",
                        in: {
                          $mergeObjects: [
                            "$$room_info",
                            {
                              tenants: { $filter: { input: "$all_tenants", as: "tenant", cond: { $eq: ["$$tenant.roomId", "$$room_info._id"] } } }
                            }
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      
      // 6. Clean up the temporary fields
      { $project: { all_rooms: 0, all_tenants: 0 } }
    ]).toArray();

    if (pgData.length === 0) {
        return NextResponse.json({ message: 'PG not found.' }, { status: 404 });
    }

    // Return the first (and only) result
    return NextResponse.json({ pg: pgData[0] });

  } catch (error) {
    console.error("Fetch PG with Tenants API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}