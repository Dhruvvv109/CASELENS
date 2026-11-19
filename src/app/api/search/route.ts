import { NextRequest, NextResponse } from "next/server";
import { JUDGMENTS } from "@/lib/data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query = "", method = "hybrid", top_k = 20, filters = {} } = body;

  if (!query.trim()) {
    return NextResponse.json({ results: JUDGMENTS.slice(0, top_k), total: top_k, query, method });
  }

  const q = query.toLowerCase();
  let results = JUDGMENTS.filter(j => {
    const matchTitle    = j.title.toLowerCase().includes(q);
    const matchCitation = j.citation?.toLowerCase().includes(q);
    const matchText     = j.fullText?.toLowerCase().includes(q);
    const matchFacts    = j.summary?.facts?.toLowerCase().includes(q);
    const matchCourt    = filters.court ? j.court.toLowerCase().includes(filters.court.toLowerCase()) : true;
    const matchType     = filters.case_type ? j.caseType === filters.case_type : true;
    return (matchTitle || matchCitation || matchText || matchFacts) && matchCourt && matchType;
  });

  if (results.length === 0) {
    // Semantic fallback: return top scored results
    results = [...JUDGMENTS]
      .sort((a, b) => (b.similarityScore ?? 0) - (a.similarityScore ?? 0))
      .slice(0, top_k);
  }

  return NextResponse.json({
    results: results.slice(0, top_k),
    total: results.length,
    query,
    method,
  });
}
