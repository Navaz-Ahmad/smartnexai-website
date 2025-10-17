import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

// This function now fetches a fully nested structure: PGs -> Floors -> Rooms -> Tenants.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json({ message: 'Owner ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    // **UPDATED & MORE POWERFUL AGGREGATION PIPELINE**
    // This joins all four collections (pgs, floors, rooms, tenants) together.
    const pgs = await db.collection("pgs").aggregate([
      // 1. Match all PGs owned by the admin
      { $match: { ownerId: new ObjectId(ownerId) } },
      
      // 2. Look up all floors belonging to this PG
      { $lookup: { from: "pg_floors", localField: "_id", foreignField: "pgId", as: "all_floors" } },

      // 3. Look up all rooms belonging to this PG
      { $lookup: { from: "pg_rooms", localField: "_id", foreignField: "pgId", as: "all_rooms" } },
      
      // 4. Look up all tenants belonging to this PG
      { $lookup: { from: "tenants", localField: "_id", foreignField: "pgId", as: "all_tenants" } },
      
      // 5. Reshape the data to nest rooms and tenants correctly within floors
      {
        $addFields: {
          floors: {
            $map: {
              input: "$all_floors",
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
                            { tenants: { $filter: { input: "$all_tenants", as: "tenant", cond: { $eq: ["$$tenant.roomId", "$$room_info._id"] } } } }
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
      
      // 6. Clean up the temporary fields for a clean response
      { $project: { all_floors: 0, all_rooms: 0, all_tenants: 0 } }
    ]).toArray();

    return NextResponse.json({ pgs });
  } catch (error) {
    console.error("Fetch Full PG Structure API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}