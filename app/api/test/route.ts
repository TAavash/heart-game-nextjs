"use client";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: "✅ MongoDB connected successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "❌ DB connection failed", error });
  }
}
