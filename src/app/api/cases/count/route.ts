import { NextResponse } from "next/server";
import { CASES } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ count: CASES.length });
}
