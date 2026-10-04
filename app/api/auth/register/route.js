import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request) {
  const { firstName, lastName, email, username, password } = await request.json();

  if (!firstName || !lastName || !email || !username || !password) {
    return NextResponse.json({ message: "All fields are required." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return NextResponse.json(
      { message: "An account with that email or username already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    firstName,
    lastName,
    email,
    username,
    password: hashedPassword,
  });

  return NextResponse.json({ message: "Account created." }, { status: 201 });
}
