"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useCartStore from "../../../lib/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const mesa = sp?.get("mesa");
  const qs = sp?.toString() ? `?${sp.toString()}` : "";
  const backToCatalog = `/catalog${qs}`;

  const total = items.reduce((sum, it) => sum + it.price * (it.quantity ?? 1), 0);
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // modal "carrinho limpo"
  const [clearedOpen, setClearedOpen] = useState(false);
  const openCleared = () => setClearedOpen(true);
  const closeCleared = () => {
    setClearedOpen(false);
    router.push(backToCatalog);
  };

  const handleClear = () => {
    clearCart();
    openCleared();
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-white">
      {/* Fundo com textura padrão */}
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

      <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-4 pb-44">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href={backToCatalog}
            className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur w-10 h-10 text-base hover:bg-white/15 transition"
            aria-label="Voltar"
            title="Voltar"
          >
            ←
          </Link>

          <div className="text-center">
            <div className="text-xs opacity-70">{mesa ? `Nome ${mesa}` : ""}</div>
            <h1 className="text-2xl font-bold leading-tight">Carrinho</h1>
          </div>

          <div className="w-10 h-10" />
        </header>

        {/* Conteúdo */}
        <section className="mt-6 space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur p-4 text-center">
              <p className="opacity-85">Sua sacola está vazia.</p>
              <div className="mt-3">
                <Link
                  href={backToCatalog}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-2 text-sm hover:bg-white/15 transition"
                >
                  Adicionar itens
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur p-4 flex items-center gap-4"
                >
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-16 h-16 object-cover rounded-xl"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl grid place-items-center bg-white/10 text-xs">
                      sem img
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="font-semibold leading-tight">{it.name}</div>
                    <div className="text-sm opacity-85">
                      {it.quantity ?? 1} × {fmt(it.price)}
                    </div>
                  </div>

                  <div className="font-semibold">{fmt((it.quantity ?? 1) * it.price)}</div>
                </div>
              ))}

              {/* Total */}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-lg opacity-85">Total</div>
                <div className="text-2xl font-bold">{fmt(total)}</div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* RODAPÉ FIXO */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          {/* Linha de botões 50/50 */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={handleClear}
              className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur px-5 py-3 text-sm font-semibold hover:bg-white/15 transition"
            >
              Limpar carrinho
            </button>

            <Link
              href={backToCatalog}
              className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur px-5 py-3 text-sm font-semibold text-center hover:bg-white/15 transition"
            >
              Adicionar mais itens
            </Link>
          </div>

          {/* CTA principal → vai para a página de checkout (confirmação/pagamento) */}
          <button
            className="w-full rounded-2xl bg-[var(--teal,#20B7A6)] px-5 py-4 text-lg font-semibold text-white shadow hover:brightness-95 transition"
            onClick={() => router.push(`/checkout${qs}`)}
            disabled={items.length === 0}
            style={items.length === 0 ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
          >
            Prosseguir para Pagamento
          </button>
        </div>
      </div>

      {/* MODAL: Carrinho limpo */}
      {clearedOpen && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Fechar"
            onClick={closeCleared}
          />
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white text-neutral-900 shadow-2xl overflow-hidden">
              <div className="p-5">
                <h2 className="text-lg font-semibold">Carrinho limpo</h2>
                <p className="mt-1 text-sm text-neutral-700">
                  Todos os itens foram removidos com sucesso.
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90"
                    onClick={closeCleared}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}