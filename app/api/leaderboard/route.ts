import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

/**
 * GET  →  returns top-10 users by score
 */
export async function GET() {
  try {
    await connectToDatabase();

    // sort by score (desc) and pick only username + score
    const topUsers = await User.find({}, { username: 1, score: 1, _id: 0 })
      .sort({ score: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ success: true, users: topUsers });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}
