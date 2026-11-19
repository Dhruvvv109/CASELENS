import { NextRequest, NextResponse } from "next/server";
import { CASES } from "@/lib/data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const c = CASES.find(x => x.id === id || x.caseNo === id);
  if (!c) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  return NextResponse.json(c);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = CASES.findIndex(x => x.id === id);
  if (idx === -1) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  const body = await req.json();
  const updated = { ...CASES[idx], ...body };
  CASES[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = CASES.findIndex(x => x.id === id);
  if (idx === -1) return NextResponse.json({ error: "Case not found" }, { status: 404 });
  CASES.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
