import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

/**
 * Registers a new user (hashes password before saving)
 */
export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully!",
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Registration error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { success: false, message: "Unknown error" },
    { status: 500 }
  );
}
}
