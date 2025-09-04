// app/(client)/cart/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

type SP = Record<string, string | string[] | undefined>;

export default function CartPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  // Só para manter compatível com o resto do fluxo (mesa/tab)
  const mesaParam = searchParams?.mesa as string | string[] | undefined;
  const mesa = useMemo(
    () => (Array.isArray(mesaParam) ? mesaParam[0] : mesaParam),
    [mesaParam]
  );

  return (
    <main className="min-h-dvh text-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/bg-bricks.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="absolute inset-0 -z-10 backdrop-blur-sm" />

      <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-6">
        <header className="flex items-center justify-between">
          <Link
            href={`/catalog${mesa ? `?tab=food&mesa=${encodeURIComponent(mesa)}` : ""}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            ← Voltar ao catálogo
          </Link>
          <h1 className="text-2xl font-bold">Carrinho</h1>
          <div className="text-xs opacity-70">{mesa ? `Mesa ${mesa}` : ""}</div>
        </header>

        {/* Placeholder simples para não travar o build; 
           depois conectamos ao Zustand/checkout */}
        <section className="mt-8 rounded-xl border border-white/15 bg-white/5 p-6 text-center">
          <p className="opacity-80">
            Seu carrinho está vazio por enquanto.
          </p>
        </section>
      </div>
    </main>
  );
}