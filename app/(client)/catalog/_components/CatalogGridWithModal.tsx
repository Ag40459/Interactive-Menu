"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import ProductModal, { type Item } from "./ProductModal";
import useCartStore from "../../../../lib/cartStore";

export default function CatalogGridWithModal({ items }: { items: Item[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const addItem = useCartStore((s) => s.addItem);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);

  // Toast simples (popup) para o requisito (3)
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2000);
  };

  function handleOpen(item: Item) {
    setSelected(item);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelected(null); 
  }

  // (2) Adicionar à sacola: adiciona qty, fecha modal e permanece no catálogo + toast
  function handleAddToCart({ item, qty }: { item: Item; qty: number }) {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    }
    handleClose();
    showToast("Produto adicionado à sacola.");
  }

  // Comprar agora: adiciona qty e vai direto para o checkout (4)
  function handleBuyNow({ item, qty }: { item: Item; qty: number }) {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    }
    handleClose();

    const qs = sp?.toString();
    router.push(`/checkout${qs ? `?${qs}` : ""}`);
  }

  return (
    <>
      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full text-center opacity-80 text-sm">
            No items in this category.
          </div>
        ) : (
          items.map((it) => (
            <ProductCard
              key={it.id}
              name={it.name}
              description={it.description}
              price={it.price}
              image={it.image}
              onClick={() => handleOpen(it)}
            />
          ))
        )}
      </section>

      <ProductModal
        open={open}
        item={selected}
        onClose={handleClose}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* TOAST */}
      {toast ? (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[var(--brown,#3E2723)] text-[var(--cream,#FAF7F2)] px-4 py-2 shadow">
          {toast}
        </div>
      ) : null}
    </>
  );
}