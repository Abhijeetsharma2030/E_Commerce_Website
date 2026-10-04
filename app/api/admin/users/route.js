import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/require-admin";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    users: users.map((user) => ({
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    })),
  });
}
