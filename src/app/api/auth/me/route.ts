import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/data";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");

  // token format: "mock-token-{email}"
  const email = token.replace("mock-token-", "");
  const user = DEMO_USERS.find(u => u.email === email) ?? DEMO_USERS[0];
  return NextResponse.json(user);
}
