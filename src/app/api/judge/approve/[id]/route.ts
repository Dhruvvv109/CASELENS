import { NextRequest, NextResponse } from "next/server";
import { CASES } from "@/lib/data";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = CASES.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  CASES[idx] = { ...CASES[idx], status: "disposed" };
  return NextResponse.json({
    msg: "Case approved and marked disposed",
    case_id: id,
    case_no: CASES[idx].caseNo,
    status: "disposed",
  });
}
