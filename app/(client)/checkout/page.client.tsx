"use client";
import { buildPixPayload } from "../../../lib/pix";
import CheckoutDelivery from "./_components/CheckoutDelivery";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useCartStore from "../../../lib/cartStore";
import { useEffect } from "react";
import AddressModal, { Address } from "../catalog/_components/AddressModal";
import drinks from "../../../data/drinks.json";
import { sendOrderViaWhatsApp, type Snapshot } from "../../../lib/wa";
import { Trash2 } from "lucide-react";



type PayMethod = "cash" | "pix";
function formatCurrencyBRL(value: string): string {
  // Remove tudo que não for número
  const numeric = value.replace(/\D/g, "");

  if (!numeric) return "";

  // Converte para número (centavos)
  const intValue = parseInt(numeric, 10);

  // Divide por 100 e aplica locale
  return (intValue / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


export default function CheckoutClient() {
  const sp = useSearchParams();

  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const mesa = sp?.get("mesa");
  const tab = sp?.get("tab") ?? "food";

  function handleRemove(id: string) {
    const st = useCartStore.getState();
    if (typeof (st as any).removeItem === "function") {
      (st as any).removeItem(id);
    } else {
      // fallback: remove filtrando o item
      useCartStore.setState({ items: st.items.filter((it) => it.id !== id) });
    }
  }

  const toCart = `/cart${sp?.toString() ? `?${sp.toString()}` : ""}`;
  const toCatalog = `/catalog?tab=${encodeURIComponent(tab)}${mesa ? `&mesa=${encodeURIComponent(mesa)}` : ""
    }`;

  const total = items.reduce((sum, it) => sum + it.price * (it.quantity ?? 1), 0);
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // pagamento
  const [method, setMethod] = useState<PayMethod>("cash");
  const [cashGiven, setCashGiven] = useState<string>("");

  const troco = useMemo(() => {
    const num = Number(
      cashGiven.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")
    );
    if (!isFinite(num)) return 0;
    return Math.max(0, num - total);
  }, [cashGiven, total]);

  // entrega
  const [delivery, setDelivery] = useState<"balcao" | "endereco" | "mesa" | "">(
    mesa ? "mesa" : "balcao"
  );

  const [openAddress, setOpenAddress] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);

  const addressSnippet = address
    ? `${address.nome} — ${[address.rua, address.numero, address.complemento, address.bairro]
      .filter(Boolean)
      .join(", ")}`
    : "";

  type DrinkData = { items: { id: string }[] };

  const DRINK_IDS = useMemo(() => {
    const data = drinks as unknown as DrinkData;
    const arr = Array.isArray(data?.items) ? data.items : [];
    return new Set(arr.map((p) => p.id));
  }, []);


  useEffect(() => {
    if (delivery === "endereco") setOpenAddress(true);
  }, [delivery]);


  // comprovante
  const [receiptFileName, setReceiptFileName] = useState<string>("");

  // chave pix
  const pixKey =
    (process.env.NEXT_PUBLIC_PIX_KEY as string | undefined) ??
    "064.899.706-51";

  const pixPayload = useMemo(() => buildPixPayload({
    key: pixKey,
    amount: total,
    name: process.env.NEXT_PUBLIC_STORE_NAME || "Pastelaria e Bar da Záza", // use ASCII p/ testar
    city: "BeloHorizonte",                                        // ASCII e <= 15
    txid: `PED-${Math.floor(Date.now() / 1000)}`             // estável o suficiente
  }), [pixKey, total]);


  const router = useRouter();

  const confirmOrder = () => {
    const snapshot: Snapshot = {
      id: String(Math.floor(Math.random() * 9000) + 1000),
      items: items.map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity ?? 1,
      })),
      total,
      method,
      troco: method === "cash" ? troco : undefined,
      pixKey: method === "pix" ? pixKey : undefined,
      destino:
        delivery === "mesa" && mesa
          ? ({ tipo: "mesa", mesa })
          : delivery === "endereco" && address
            ? ({
              tipo: "entrega",
              endereco: `${address.nome} — ${[
                address.rua,
                address.numero,
                address.complemento,
                address.bairro,
                address.cidade,
              ]
                .filter(Boolean)
                .join(", ")}`,
            })
            : ({ tipo: "retirada" }),
    };

    // Guarda local (se quiser mostrar recibo depois)
    localStorage.setItem("lastOrderSnapshot", JSON.stringify(snapshot));

    // Envia para o WhatsApp do lojista (fixo neste MVP)
    sendOrderViaWhatsApp(snapshot, "5534988113871");

    // (Opcional) redirecionar para uma tela de obrigado:
    // router.push(`/receipt?order=${snapshot.id}${mesa ? `&mesa=${mesa}` : ""}&tab=${tab}`);
  };


  // Estado vazio
  if (items.length === 0) {
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

        <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-6">
          <header className="flex items-center justify-between">
            <Link
              href={toCart}
              className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur w-10 h-10 text-base hover:bg-white/15 transition"
              aria-label="Voltar"
              title="Voltar"
            >
              ←
            </Link>
            <h1 className="text-xl font-bold">Confirmação de Pedido</h1>
            <div className="w-10 h-10" />
          </header>

          <div className="mt-8 rounded-2xl bg-white/10 border border-white/20 backdrop-blur p-6 text-center">
            <p className="opacity-85">Sua sacola está vazia.</p>
            <div className="mt-3">
              <Link
                href={toCatalog}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-2 text-sm hover:bg-white/15 transition"
              >
                Voltar ao catálogo
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // UI principal
  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-white">
      {/* Fundo com textura */}
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
            href={toCatalog}
            className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur w-10 h-10 text-base hover:bg-white/15 transition"
            aria-label="Voltar"
            title="Voltar"
          >
            ←
          </Link>

          <div className="text-center">
            <div className="text-xs opacity-70">{mesa ? `Mesa ${mesa}` : ""}</div>
            <h1 className="text-2xl font-bold leading-tight">
              Confirmação de Pedido
            </h1>
          </div>

          <div className="w-10 h-10" />
        </header>

        {/* Card principal */}
        <section className="mt-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur p-5">
          {/* Resumo */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
            <Link
              href={toCatalog}
              className="text-sm opacity-90 underline-offset-2 hover:underline"
              title="Ir ao catálogo para adicionar mais itens"
            >
              Adicionar mais itens
            </Link>
          </div>

          <div className="mt-3 divide-y divide-white/15">

            {items.map((it) => {
              const icon = DRINK_IDS.has(it.id) ? "🥤" : "🍽️"; // bebida vs. comida (neutros)
              return (
                <div key={it.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="text-xl">{icon}</span>
                    <span>
                      {it.name}{" "}
                      <span className="opacity-80">x{it.quantity ?? 1}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="font-medium">
                      {fmt((it.quantity ?? 1) * it.price)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(it.id)}
                      className="ml-1 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
                      aria-label={`Remover ${it.name}`}
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );

            })}


          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="opacity-90">Valor Total:</span>
            <span className="text-xl font-bold">{fmt(total)}</span>
          </div>

          {/* Pagamento */}
          <h3 className="mt-6 text-lg font-semibold">Formas de Pagamento</h3>

          {/* Botões Cash / Pix */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMethod("cash")}
              className={`h-12 rounded-2xl font-semibold ${method === "cash"
                ? "bg-[var(--terracotta,#DDA48F)] text-white"
                : "bg-white/10 border border-white/20"
                }`}
            >
              Dinheiro
            </button>
            <button
              type="button"
              onClick={() => setMethod("pix")}
              className={`h-12 rounded-2xl font-semibold ${method === "pix"
                ? "bg-[var(--terracotta,#DDA48F)] text-white"
                : "bg-white/10 border border-white/20"
                }`}
            >
              Pix
            </button>
          </div>

          {/* Dinheiro */}
          {method === "cash" && (
            <div className="mt-3 rounded-2xl bg-white/5 border border-white/15 p-3">
              <label className="block text-sm opacity-90 mb-2">
                Quanto vai pagar?
              </label>
              <input
                inputMode="numeric"
                placeholder="R$ 0,00"
                value={cashGiven}
                onChange={(e) => setCashGiven(formatCurrencyBRL(e.target.value))}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none"
              />
              <div className="mt-2 text-sm opacity-90">
                Troco: <strong>{fmt(troco)}</strong>
              </div>
            </div>
          )}

          {/* Pix */}
          {method === "pix" && (
            <div className="mt-3 rounded-2xl bg-white/5 border border-white/15 p-3 space-y-3">
              <div className="flex items-center gap-3">
                {/* QR gerado a partir do payload */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pixPayload)}&size=120x120`}
                  alt="QR Pix"
                  className="rounded bg-white p-1"
                />
                <div className="flex-1">
                  <div className="text-sm opacity-85">
                    Chave Pix: <span className="font-medium">{pixKey}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    Valor: <span className="font-medium">{fmt(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(pixPayload)}
                  className="rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-sm hover:bg-white/15"
                  title="Copiar código Pix"
                >
                  Copiar
                </button>
              </div>

              {/* Pix copia e cola */}
              <textarea
                readOnly
                className="w-full rounded-xl bg-white/10 border border-white/20 p-2 text-xs"
                value={pixPayload}
              />
            </div>
          )}

          {/* Entrega */}
          <h3 className="mt-6 text-lg font-semibold">Forma de Entrega</h3>
          <div className="mt-3 space-y-2">
            {/* Retirar no balcão */}
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                className="accent-[var(--teal,#20B7A6)]"
                checked={delivery === "balcao"}
                onChange={() => setDelivery("balcao")}
              />
              Retirar no balcão
            </label>

            {/* Receber na mesa (somente se mesa existir) */}
            {mesa && (
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  className="accent-[var(--teal,#20B7A6)]"
                  checked={delivery === "mesa"}
                  onChange={() => setDelivery("mesa")}
                />
                Receber na mesa
              </label>
            )}

            {/* Entregar no endereço */}
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                className="accent-[var(--teal,#20B7A6)]"
                checked={delivery === "endereco"}
                onChange={() => setDelivery("endereco")}
              />
              Entregar no endereço
            </label>

            {delivery === "endereco" && address && (
              <div className="ml-7 mt-1 rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm flex items-start justify-between gap-3">
                <div className="opacity-90">
                  <div className="font-medium">Endereço confirmado</div>
                  <div className="opacity-85">
                    {addressSnippet}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAddress(null);
                    setOpenAddress(false);
                    setDelivery(mesa ? "mesa" : "balcao");
                  }}
                  className="shrink-0 rounded-lg bg-white/10 border border-white/20 px-2.5 py-1 text-xs hover:bg-white/15"
                  title="Limpar endereço"
                >
                  Limpar endereço
                </button>
              </div>
            )}
          </div>


          {method === "pix" && (
            <div className="mt-4">
              <label className="block text-sm opacity-90 mb-2">
                Anexar comprovante (Opcional)
              </label>
              <label className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm hover:bg-white/15 cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setReceiptFileName(f ? f.name : "");
                  }}
                />
                {receiptFileName ? receiptFileName : "Selecionar arquivo"}
              </label>
            </div>
          )}

        </section>
      </div>

      <AddressModal
        key={`${openAddress}-${address ? "filled" : "empty"}`}
        open={openAddress}
        initial={address ?? {}}
        onClose={() => {
          setOpenAddress(false);
          if (!address) setDelivery(mesa ? "mesa" : "balcao");
        }}
        onConfirm={(addr) => {
          setAddress(addr);
          setOpenAddress(false);
        }}
      />

      {/* Rodapé fixo - CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
          <button
            type="button"
            onClick={confirmOrder}
            className="w-full rounded-2xl bg-[var(--terracotta,#DDA48F)] px-5 py-4 text-lg font-semibold text-white shadow hover:brightness-105"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </main>
  );
}