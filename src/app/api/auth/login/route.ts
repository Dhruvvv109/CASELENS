import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = DEMO_USERS.find(u => u.email === email);
  if (!user || password !== "demo123") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ access_token: `mock-token-${email}`, user });
}
