"use client";

import { Suspense } from "react";
import ReceiptClient from "./ReceiptClient"; // veremos no passo 2

export default function ReceiptPage() {
  return (
    <Suspense fallback={null}>
      <ReceiptClient />
    </Suspense>
  );
}