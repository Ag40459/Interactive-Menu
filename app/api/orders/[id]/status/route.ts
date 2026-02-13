// app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Note: o validator da sua build espera params como Promise<{ id: string }>
type CtxPromise = { params: Promise<{ id: string }> };

// PATCH /api/orders/:id/status
export async function PATCH(req: NextRequest, ctx: CtxPromise) {
  const { id } = await ctx.params; // ← await aqui é o ponto chave
  const body = await req.json().catch(() => null);

  return NextResponse.json({
    ok: true,
    orderId: id,
    received: body,
    message: "Order status updated (stub)",
  });
}

// GET /api/orders/:id/status
export async function GET(_req: NextRequest, ctx: CtxPromise) {
  const { id } = await ctx.params; // ← await aqui também
  return NextResponse.json({
    ok: true,
    orderId: id,
    message: "Status endpoint alive",
  });
}