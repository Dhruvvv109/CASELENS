import { NextResponse } from "next/server";
import { CASES, JUDGMENTS } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    db: "in-memory",
    index_loaded: true,
    version: "1.0.0",
    environment: process.env.NODE_ENV ?? "development",
    embedding_model: "sentence-transformers/all-MiniLM-L6-v2",
    embedding_dimension: 384,
    cases_count: CASES.length,
    judgments_count: JUDGMENTS.length,
  });
}
