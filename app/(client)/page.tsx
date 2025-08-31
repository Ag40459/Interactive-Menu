// app/(client)/page.tsx
// Landing “Cardápio digital em construção” — responsiva, bonita, com WhatsApp (link pequeno)
// Tailwind v4 + variáveis via .env

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME ?? "Pastelaria e Bar da Zazá";
const RAW_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "(34) 98811-3871";
const PHONE_E164 = (() => {
  const d = digitsOnly(RAW_PHONE);
  return d.startsWith("55") ? d : `55${d}`;
})();
const WA_TEXT = encodeURIComponent("Olá! Cheguei pelo site do cardápio. Pode me ajudar?");
// Imagem lateral opcional (coloque em /public/images/ e defina no .env)
// NEXT_PUBLIC_UC_IMAGE="/images/under.jpg"
const SIDE_IMAGE = process.env.NEXT_PUBLIC_UC_IMAGE || "";

export default function Home() {
  return (
    <main className="min-h-screen p-6 grid place-items-center bg-[var(--cream)]">
      {/* Fundo suave */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 50% at 10% 10%, #e7d6c744 0%, transparent 60%), radial-gradient(40% 35% at 90% 20%, #2fb3b51a 0%, transparent 70%), linear-gradient(180deg, #fdfbf7 0%, #f8f2ea 100%)",
        }}
      />

      <section className="w-full max-w-[1100px]">
        <div className="overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[var(--terracotta)]/60">
          <div className="h-2 w-full bg-[var(--terracotta)]/60" />

          <div className="grid md:grid-cols-2 gap-0">
            {/* Lado visual */}
            <div className="hidden md:flex items-center justify-center p-8">
              {SIDE_IMAGE ? (
                <img
                  src={SIDE_IMAGE}
                  alt="Prévia do cardápio digital"
                  className="w-[92%] max-w-[460px] rounded-2xl shadow-sm object-cover"
                  draggable={false}
                />
              ) : (
                <svg
                  viewBox="0 0 360 300"
                  className="w-[88%] max-w-[460px]"
                  aria-label="Cardápio digital em construção"
                >
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#e7d6c7" />
                      <stop offset="100%" stopColor="#fdfbf7" />
                    </linearGradient>
                  </defs>
                  <rect x="20" y="230" width="320" height="14" rx="7" fill="url(#g1)" />
                  <rect x="60" y="60" width="240" height="120" rx="14" fill="#fff" stroke="#e7d6c7" />
                  <text x="180" y="110" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="16" fill="#4a2c2a">
                    {STORE_NAME}
                  </text>
                  <text x="180" y="135" textAnchor="middle" fontFamily="ui-sans-serif" fontSize="12" fill="#7a5b57">
                    Cardápio digital em construção
                  </text>
                  <rect x="95" y="155" width="60" height="10" rx="5" fill="#a86f6f" />
                  <rect x="160" y="155" width="60" height="10" rx="5" fill="#2fb3b5" />
                  <circle cx="120" cy="210" r="22" fill="#e7d6c7" />
                  <rect x="110" y="220" width="20" height="24" rx="6" fill="#4a2c2a" />
                  <polygon points="270,228 282,198 294,228" fill="#e7d6c7" />
                  <rect x="277" y="198" width="10" height="18" fill="#a86f6f" opacity="0.5" />
                </svg>
              )}
            </div>

            {/* Conteúdo */}
            <div className="px-7 py-10 md:px-12 md:py-14 text-center flex flex-col items-center">
              <p className="text-sm text-[var(--brown)]/60 uppercase tracking-[0.18em] mb-2">
                {STORE_NAME}
              </p>

              <h1 className="text-[28px] md:text-[34px] font-bold tracking-tight text-[var(--brown)]">
                Cardápio digital em construção
              </h1>

              <p className="mt-4 max-w-[48ch] text-[15px] md:text-[17px] leading-relaxed text-[var(--brown)]/90">
                Estamos preparando algo saboroso. Em breve você poderá consultar o cardápio
                e fazer seus pedidos diretamente por aqui. 🍽️
              </p>

              {/* CTA pequeno: WhatsApp (somente link, sem ícone grande) */}
              <div className="mt-7">
                <a
                  href={`https://wa.me/${PHONE_E164}?text=${WA_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg border border-[var(--terracotta)]/70 px-4 py-2 text-sm font-medium 
                             text-[var(--brown)] hover:bg-[var(--terracotta)]/20 transition"
                >
                  Falar no WhatsApp
                </a>
              </div>

              {/* Status */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--terracotta)]/70 px-4 py-2 bg-white/70">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--teal)] animate-pulse" />
                <span className="text-xs md:text-sm font-medium text-[var(--brown)]/80">
                  Lançamento em breve
                </span>
              </div>

              <p className="mt-10 text-xs text-[var(--brown)]/70">
                © {new Date().getFullYear()} {STORE_NAME} — Todos os direitos reservados
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}