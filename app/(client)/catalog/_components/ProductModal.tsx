// app/(client)/catalog/_components/ProductModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export type Item = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
};

type Props = {
  open: boolean;
  item: Item | null;
  onClose: () => void;
  onAddToCart: (p: { item: Item; qty: number }) => void;
  onBuyNow: (p: { item: Item; qty: number }) => void;
};

export default function ProductModal({ open, item, onClose, onAddToCart, onBuyNow }: Props) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => { if (item) setQty(1); }, [item]);

  const priceText = useMemo(
    () => (item ? Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.price) : ""),
    [item]
  );

  if (!open || !item) return null;

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const handleAdd = () => onAddToCart({ item, qty });
  const handleBuy = () => onBuyNow({ item, qty });

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white text-neutral-900 rounded-[28px] shadow-2xl overflow-hidden relative">
          <div className="relative px-5 pt-5">
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 h-10 w-10 grid place-items-center rounded-full bg-white !text-black shadow-lg hover:bg-neutral-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="block"
                   fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover rounded-2xl"
                draggable={false}
              />
            ) : null}
          </div>

          <div className="px-6 pt-5 pb-2">
            <h2 className="text-2xl font-semibold leading-tight">{item.name}</h2>
            {item.description ? (
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">{item.description}</p>
            ) : null}

            <div className="mt-5 flex items-center justify-between">
              <div className="text-2xl font-semibold">{priceText}</div>
              <div className="inline-flex items-center rounded-xl border border-neutral-400 bg-white">
                <button
                  type="button"
                  aria-label="Diminuir"
                  onClick={dec}
                  className="h-10 w-10 grid place-items-center hover:bg-neutral-200 !text-black"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="block"
                       fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <div className="w-12 text-center font-semibold !text-black select-none">{qty}</div>
                <button
                  type="button"
                  aria-label="Aumentar"
                  onClick={inc}
                  className="h-10 w-10 grid place-items-center hover:bg-neutral-200 !text-black"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="block"
                       fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 h-12 rounded-xl font-semibold text-white bg-[var(--terracotta,#a86f6f)] hover:brightness-110"
            >
              Adicionar à sacola
            </button>
            <button
              type="button"
              onClick={handleBuy}
              className="flex-1 h-12 rounded-xl font-semibold text-white bg-[var(--teal,#2fb3b5)] hover:brightness-110"
            >
              Comprar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}