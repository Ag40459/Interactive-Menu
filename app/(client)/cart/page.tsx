import { Suspense } from "react";
import CartPageClient from "./page.client";

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh grid place-items-center text-white">
          Carregando…
        </main>
      }
    >
      <CartPageClient />
    </Suspense>
  );
}