import { NextResponse } from "next/server";

import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }

  return { session };
}
