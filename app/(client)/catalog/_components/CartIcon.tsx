"use client";

import Link from "next/link";
import useCartStore from "../../../../lib/cartStore";

export default function CartIcon({ href }: { href: string }) {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, it) => sum + (it.quantity ?? 1), 0);

  return (
    <Link
      href={href}
      className="relative inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur w-10 h-10 text-base hover:bg-white/15 transition"
      aria-label="Carrinho"
      title="Carrinho"
    >
      🛒
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[var(--teal,#20B7A6)] text-white text-xs font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}