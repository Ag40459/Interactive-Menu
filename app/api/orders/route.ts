// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/orders  → lista (stub)
export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true, items: [], message: "Orders list (stub)" });
}

// POST /api/orders → cria (stub)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  return NextResponse.json(
    { ok: true, id: "stub-id", received: body, message: "Order created (stub)" },
    { status: 201 }
  );
}