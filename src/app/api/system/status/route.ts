import { NextResponse } from "next/server";
import { CASES, JUDGMENTS, getSystemStatus } from "@/lib/data";

export async function GET() {
  const base = getSystemStatus();
  return NextResponse.json({
    ...base,
    db_pending_cases_count: CASES.length,
    db_judgments_count: JUDGMENTS.length,
    faiss_vector_count: JUDGMENTS.length,
  });
}
