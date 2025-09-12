"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useCartStore from "../../../lib/cartStore";

type PayMethod = "cash" | "pix";

type OrderSnapshot = {
    id: string;
    items: Array<{ id: string; name: string; price: number; quantity?: number }>;
    total: number;
    method: PayMethod;
    troco?: number;               // se method === "cash"
    pixKey?: string;              // se method === "pix"
    destino:
    | { tipo: "mesa"; mesa: string }
    | { tipo: "retirada" }
    | { tipo: "entrega"; endereco: string };
};

const LS_KEY = "lastOrderSnapshot";

export default function ReceiptPage() {
    const sp = useSearchParams();
    const router = useRouter();

    const mesa = sp.get("mesa") || "";
    const tab = sp.get("tab") || "food";
    const orderIdFromUrl = sp.get("order") || "";

    const toCatalog = `/catalog?tab=${encodeURIComponent(tab)}${mesa ? `&mesa=${encodeURIComponent(mesa)}` : ""
        }`;

    const [snap, setSnap] = useState<OrderSnapshot | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) setSnap(JSON.parse(raw));
        } catch { }
    }, []);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const fmt = (v: number) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const titleId = useMemo(
        () => (snap?.id ? `#${snap.id}` : orderIdFromUrl ? `#${orderIdFromUrl}` : ""),
        [snap?.id, orderIdFromUrl]
    );

    function handleDownload() {
        // MVP: aciona diálogo do navegador (imprimir/salvar em PDF)
        window.print();
    }

    function handleNewOrder() {
        try {
            // Zera carrinho
            useCartStore.getState().clear();

            // Remove snapshot de recibo
            localStorage.removeItem(LS_KEY);
        } catch { }

        // Redireciona substituindo no histórico
        router.replace(toCatalog);
    }


    // Fallback se recarregar sem snapshot
    if (!snap) {
        return (
            <main className="relative min-h-dvh w-full overflow-hidden text-white">
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
                <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-8 text-center">
                    <h1 className="text-3xl font-extrabold mb-6">Pedido enviado</h1>
                    <p className="opacity-90">Não encontramos os dados do comprovante.</p>
                    <div className="mt-6">
                        <Link
                            href={toCatalog}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm hover:bg-white/15"
                        >
                            Voltar ao catálogo
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-dvh w-full overflow-hidden text-white">
            {/* fundo */}
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

            <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-6 pb-36">
                <header className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10" />
                    <h1 className="text-3xl font-extrabold text-center leading-tight">
                        Pedido Enviado
                        <br />com Sucesso
                    </h1>
                    <div className="w-10 h-10" />
                </header>

                {/* Comprovante */}
                <section
                    ref={cardRef}
                    className="rounded-3xl bg-white/10 border border-white/20 backdrop-blur p-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Pedido {titleId}</h2>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-full grid place-items-center bg-white/10 border border-white/20 hover:bg-white/15"
                            title="Fechar comprovante"
                            onClick={() => cardRef.current?.classList.toggle("hidden")}
                        >
                            ×
                        </button>
                    </div>

                    {/* Itens */}
                    <div className="mt-3 divide-y divide-white/15">
                        {snap.items.map((it, idx) => (
                            <div
                                key={it.id ?? `${it.name}-${idx}`}
                                className="py-2 flex items-center justify-between text-[15px]"
                            >
                                <span>
                                    {it.name} <span className="opacity-75">x{it.quantity ?? 1}</span>
                                </span>
                                <span className="font-medium">
                                    {fmt((it.quantity ?? 1) * it.price)}
                                </span>
                            </div>
                        ))}

                        <div className="pt-3 flex items-center justify-between">
                            <span className="opacity-90">Total:</span>
                            <span className="text-lg font-extrabold">{fmt(snap.total)}</span>
                        </div>
                    </div>

                    {/* Pagamento */}
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-1.5">
                        <div>
                            <span className="opacity-90">Forma de Pagamento: </span>
                            <strong>{snap.method === "cash" ? "Dinheiro" : "Pix"}</strong>
                        </div>
                        {snap.method === "cash" && (
                            <div>
                                <span className="opacity-90">Troco: </span>
                                <strong>{fmt(snap.troco ?? 0)}</strong>
                            </div>
                        )}
                        {snap.method === "pix" && snap.pixKey && (
                            <div className="break-all">
                                <span className="opacity-90">Chave Pix: </span>
                                <strong>{snap.pixKey}</strong>
                            </div>
                        )}
                    </div>

                    {/* Destino */}
                    <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-1.5">
                        {snap.destino.tipo === "mesa" && (
                            <div>
                                <span className="opacity-90">Identificação do Pedido: </span>
                                <strong>Mesa {snap.destino.mesa}</strong>
                            </div>
                        )}
                        {snap.destino.tipo === "retirada" && (
                            <div>
                                <strong>Retirada no Balcão</strong>
                            </div>
                        )}
                        {snap.destino.tipo === "entrega" && (
                            <>
                                <div>
                                    <strong>Entrega</strong>
                                </div>
                                <div className="opacity-90">{snap.destino.endereco}</div>
                            </>
                        )}
                    </div>

                    {/* Download */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--terracotta,#DDA48F)] text-white hover:brightness-105"
                            title="Baixar comprovante"
                            aria-label="Baixar comprovante"
                        >
                            ⬇
                        </button>
                    </div>
                </section>

                {/* CTAs */}
                <div className="mt-6 space-y-4">
                    <button
                        onClick={handleNewOrder}
                        className="w-full rounded-2xl bg-[var(--terracotta,#DDA48F)] px-5 py-4 text-lg font-semibold text-white shadow hover:brightness-105"
                    >
                        Fazer novo pedido
                    </button>
                    <Link
                        href="/"
                        className="block text-center w-full rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-lg font-semibold hover:bg-white/15"
                    >
                        Voltar ao início
                    </Link>
                </div>
            </div>
        </main>
    );
}