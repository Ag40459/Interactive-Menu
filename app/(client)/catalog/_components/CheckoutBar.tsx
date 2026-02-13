"use client";

import Link from "next/link";
import useCartStore from "../../../../lib/cartStore";

export default function CheckoutBar({ href }: { href: string }) {
  const itemsLen = useCartStore((s) => s.items.length);
  if (itemsLen === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-screen-sm -translate-x-1/2 px-4 sm:px-6">
      <Link
        href={href}
        className="block w-full rounded-2xl bg-[var(--teal,#20B7A6)] px-5 py-4 text-center text-white text-lg font-semibold shadow hover:brightness-95"
      >
        Finalizar compra
      </Link>
    </div>
  );
}