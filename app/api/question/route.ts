
import { NextResponse } from "next/server";

/**
 * Fetches a question from the Heart Game API.
 * Demonstrates interoperability: external API → our backend → frontend.
 */
export async function GET() {
  try {
    const res = await fetch("https://marcconrad.com/uob/heart/api.php", {
      cache: "no-store", // ensure we always get a fresh question
    });

    if (!res.ok) {
      throw new Error("Failed to fetch question from Heart Game API");
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
  const err = error as Error;
  console.error("❌ Heart API Error:", err.message);
  return NextResponse.json(
    { success: false, message: "Error fetching question", error: err.message },
    { status: 500 }
  );
}
}
