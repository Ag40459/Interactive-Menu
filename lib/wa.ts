// lib/wa.ts
export type Snapshot = {
    id: string;
    items: { name: string; price: number; quantity: number }[];
    total: number;
    method: "cash" | "pix";
    troco?: number;
    pixKey?: string;
    destino:
    | { tipo: "mesa"; mesa: string }
    | { tipo: "retirada" }
    | { tipo: "entrega"; endereco: string };
};

export function onlyDigits(v: string) {
    return v.replace(/\D+/g, "");
}

export function buildWhatsAppText(snapshot: Snapshot) {
    const loja = (process.env.NEXT_PUBLIC_STORE_NAME as string | undefined) ?? "Pastelaria e Bar da Záza";
    const moeda = (n: number) =>
        n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const now = new Date();
    const quando = now.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });

    // ——— Cabeçalho
    const linhas: string[] = [];
    linhas.push(`*${loja}*`);
    linhas.push(`*PEDIDO #${snapshot.id}*  •  ${quando}`);
    linhas.push(`────────────────────`);

    // ——— Itens
    linhas.push(`*Itens*`);
    snapshot.items.forEach((it) => {
        const subtotal = moeda(it.price * it.quantity);
        // Formato: • Nome
        //          xQTY — R$ subtotal
        linhas.push(`• ${it.name}`);
        linhas.push(`  x${it.quantity} — ${subtotal}`);
    });

    // ——— Totais / Pagamento
    linhas.push(`────────────────────`);
    linhas.push(`*Total:* ${moeda(snapshot.total)}`);

    if (snapshot.method === "cash") {
        linhas.push(`*Pagamento:* Dinheiro`);
        if (typeof snapshot.troco === "number") {
            linhas.push(`*Troco:* ${moeda(snapshot.troco)}`);
        }
    } else {
        linhas.push(`*Pagamento:* Pix`);
        if (snapshot.pixKey) linhas.push(`*Chave:* ${snapshot.pixKey}`);
    }

    // ——— Destino
    linhas.push(`────────────────────`);
    if (snapshot.destino.tipo === "mesa") {
        linhas.push(`*Receber na mesa:* ${snapshot.destino.mesa}`);
    } else if (snapshot.destino.tipo === "retirada") {
        linhas.push(`*Retirada no balcão*`);
    } else {
        linhas.push(`*Entrega no endereço*`);
        linhas.push(`${snapshot.destino.endereco}`);
    }

    // ——— Rodapé
    linhas.push(`────────────────────`);
    linhas.push(`_Enviado pelo Cardápio Digital_`);

    return linhas.join("\n");
}


/** Abre o WhatsApp (app quando possível; fallback para wa.me no desktop) */
export function openWhatsApp(phoneDigits: string, text: string) {
    const phone = onlyDigits(phoneDigits); // ex.: 5581985967343
    const encoded = encodeURIComponent(text);

    const appUrl = `whatsapp://send?phone=${phone}&text=${encoded}`;
    const webUrl = `https://wa.me/${phone}?text=${encoded}`;

    const opened = window.open(appUrl, "_blank");
    setTimeout(() => {
        if (!opened || opened.closed) window.open(webUrl, "_blank");
    }, 300);
}

/** Função de alto nível para o checkout chamar */
export function sendOrderViaWhatsApp(snapshot: Snapshot, storePhone: string) {
    const text = buildWhatsAppText(snapshot);
    openWhatsApp(storePhone, text);
}
