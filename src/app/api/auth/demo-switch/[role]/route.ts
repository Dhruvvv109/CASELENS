import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/data";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
  const { role } = await params;
  const user = DEMO_USERS.find(u => u.role === role) ?? DEMO_USERS[0];
  return NextResponse.json({ access_token: `mock-token-${user.email}`, user });
}
