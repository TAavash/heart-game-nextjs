import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

/**
 * POST → updates score only if it's higher
 * GET  → fetch current & highest score
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { score } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("User not found");

    // Only update if new score is higher
    if (score > (user.score || 0)) {
      user.score = score;
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Score checked/updated", score: user.score });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    return NextResponse.json({
      success: true,
      score: user?.score ?? 0,
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}
