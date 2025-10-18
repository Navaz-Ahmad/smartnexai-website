import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

const pgDbUri = process.env.MONGODB_URI_PG!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId');

    if (!pgId) {
      return NextResponse.json({ message: 'PG ID is required.' }, { status: 400 });
    }

    const client = await connectToDatabase(pgDbUri);
    const db = client.db();

    const pgData = await db.collection("pgs").aggregate([
      { $match: { _id: new ObjectId(pgId) } },
      { $lookup: { from: "pg_floors", localField: "_id", foreignField: "pgId", as: "floors" } },
      { $lookup: { from: "pg_rooms", localField: "_id", foreignField: "pgId", as: "all_rooms" } },
      { $lookup: { from: "tenants", localField: "_id", foreignField: "pgId", as: "all_tenants" } },
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
                              tenants: {
                                // **THE FIX IS HERE: We now project more fields for each tenant**
                                $map: {
                                  input: { $filter: { input: "$all_tenants", as: "tenant", cond: { $eq: ["$$tenant.roomId", "$$room_info._id"] } } },
                                  as: "t",
                                  in: {
                                    _id: "$$t._id",
                                    name: "$$t.name",
                                    mobile: "$$t.mobile",
                                    email: "$$t.email",
                                    photoBase64: "$$t.photoBase64" // Include the photo data
                                  }
                                }
                              }
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
      { $project: { all_rooms: 0, all_tenants: 0 } }
    ]).toArray();

    if (pgData.length === 0) {
        return NextResponse.json({ message: 'PG not found.' }, { status: 404 });
    }

    return NextResponse.json({ pg: pgData[0] });

  } catch (error) {
    console.error("Fetch PG with Tenants API Error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}