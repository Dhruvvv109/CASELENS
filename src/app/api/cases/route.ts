import { NextRequest, NextResponse } from "next/server";
import { CASES } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const court = searchParams.get("court");
  const status = searchParams.get("status");
  const complexity = searchParams.get("complexity");
  const limit = Math.min(parseInt(searchParams.get("limit") || "200"), 500);
  const offset = parseInt(searchParams.get("offset") || "0");

  let results = [...CASES];

  if (court && court !== "all") {
    results = results.filter(c =>
      c.court.toLowerCase().includes(court.toLowerCase())
    );
  }
  if (status) {
    results = results.filter(c => c.status === status);
  }
  if (complexity) {
    results = results.filter(c => c.prediction.complexity === complexity);
  }

  const total = results.length;
  const paginated = results.slice(offset, offset + limit);

  return NextResponse.json({ total, cases: paginated, limit, offset });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { caseNo, caseType, court, filingDate, hearingsCount, description } = body;

  if (!caseNo || !court) {
    return NextResponse.json({ error: "caseNo and court are required" }, { status: 400 });
  }

  const existing = CASES.find(c => c.caseNo === caseNo);
  if (existing) {
    return NextResponse.json({ error: `Case ${caseNo} already exists` }, { status: 409 });
  }

  const hearings = hearingsCount || 1;
  const topSim = 0.75;
  const predictedDays = Math.max(30, 180 + hearings * 15 - topSim * 160);
  const priority = Math.min(98, Math.max(45, 50 + topSim * 35 + hearings * 0.8));
  const complexity: "Low" | "Medium" | "High" = hearings > 20 ? "High" : hearings > 10 ? "Medium" : "Low";

  const newCase = {
    id: `case-new-${Date.now()}`,
    caseNo,
    caseType: caseType || "CRL.A",
    court,
    filingDate: filingDate || new Date().toISOString().split("T")[0],
    hearingsCount: hearings,
    status: "pending" as const,
    bench: court.includes("Supreme") ? "Division Bench IV" : "Single Bench",
    petitioner: "Petitioner",
    respondent: "Respondent",
    actsSections: ["Constitution Art. 226"],
    description: description || "Fresh petition registered.",
    top1Similarity: topSim,
    meanTop5Similarity: 0.68,
    countAboveThreshold: 2,
    matchedPrecedentIds: ["prec-001"],
    prediction: {
      predictedDays: Math.round(predictedDays),
      complexity,
      priorityScore: Number(priority.toFixed(1)),
      confidenceIntervalDays: [Math.round(predictedDays - 30), Math.round(predictedDays + 40)] as [number, number],
      precedentConfidence: topSim,
      shapFactors: [
        {
          feature: "Fresh Registration",
          impact: "increases_delay" as const,
          impactDays: 25,
          plainEnglishReason: "New case — initial docket admission notice required.",
        },
      ],
    },
  };

  CASES.unshift(newCase);
  return NextResponse.json(newCase, { status: 201 });
}
