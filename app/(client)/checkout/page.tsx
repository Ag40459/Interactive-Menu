import { Suspense } from "react";
import CheckoutClient from "./page.client";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh grid place-items-center text-white">
          Carregando…
        </main>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}