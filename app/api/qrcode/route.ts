// app/api/qrcode/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  text?: string;   // texto já pronto p/ virar QR (prioritário)
  mesa?: string;   // número da mesa (gera URL /menu?mesa=...)
  table?: string;  // alias
  baseUrl?: string; // opcional p/ forçar host (ex.: https://seu-dominio.com.br)
};

function buildText(payload: Payload, req: NextRequest): string {
  const current = new URL(req.nextUrl);
  const origin = payload.baseUrl || current.origin;

  // Se o cliente mandou text explícito, usa direto:
  if (payload.text && payload.text.trim().length > 0) return payload.text;

  // Senão, monta a URL do /menu com mesa opcional:
  const mesa = payload.mesa ?? payload.table;
  if (mesa) return `${origin}/menu?mesa=${encodeURIComponent(mesa)}`;

  // Fallback: só a home do cardápio
  return `${origin}/menu`;
}

// GET /api/qrcode?text=... | ?mesa=12 | ?table=12 [&baseUrl=...]
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const text = sp.get("text") ?? undefined;
  const mesa = sp.get("mesa") ?? sp.get("table") ?? undefined;
  const baseUrl = sp.get("baseUrl") ?? undefined;

  const final = buildText({ text, mesa, baseUrl }, req);
  // Aqui retornamos só o "text" — o front renderiza o QR (canvas/lib)
  return NextResponse.json({ ok: true, text: final });
}

// POST /api/qrcode  { text?: string, mesa?: string, table?: string, baseUrl?: string }
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<Payload>;
  const final = buildText(body, req);
  return NextResponse.json({ ok: true, text: final });
}