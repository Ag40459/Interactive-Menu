// app/(client)/menu/page.tsx
import Link from "next/link";

type SP = Record<string, string | string[] | undefined>;

export default async function MenuHome({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await searchParams;
  const mesaParam = (sp?.mesa ?? sp?.table) as string | string[] | undefined;
  const mesa = Array.isArray(mesaParam) ? mesaParam[0] : mesaParam;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Sua Loja";

  const mesaQS = mesa ? `&mesa=${encodeURIComponent(mesa)}` : "";

  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-white">
      {/* Fundo com imagem enviada (.png) + overlay/blur */}
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

      {/* Topo: nome da loja + Mesa */}
      <header className="mx-auto w-full max-w-screen-sm px-6 pt-6 flex items-center justify-between">
        <div className="leading-tight">
          <h1 className="text-lg font-semibold opacity-90">{storeName}</h1>
          <p className="text-xs opacity-70">Faça seu pedido pelo cardápio digital</p>
        </div>
        {mesa ? (
          <div className="rounded-full px-4 py-2 text-sm font-semibold shadow-lg bg-white/10 backdrop-blur border border-white/30">
            Mesa {mesa}
          </div>
        ) : null}
      </header>

      {/* Campo "Número da mesa" (apenas se não vier na URL) */}
      {!mesa ? (
        <form method="GET" className="mx-auto mt-6 w-full max-w-screen-sm px-6">
          <label className="sr-only" htmlFor="mesa">Número da mesa</label>
          <div className="flex items-center gap-3 rounded-full border border-white/40 bg-black/20 backdrop-blur px-5 py-3">
            <input
              id="mesa"
              name="mesa"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Número da mesa"
              className="flex-1 bg-transparent outline-none placeholder-white/80 text-white"
            />
            <button className="rounded-full px-4 py-2 text-sm font-semibold bg-white/20 hover:bg-white/30 transition">
              Confirmar
            </button>
          </div>
        </form>
      ) : null}

      {/* Conteúdo central */}
      <section className="mx-auto w-full max-w-screen-sm px-6 text-center flex flex-col items-center gap-8 md:gap-10 pt-10 md:pt-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-md">Bem-vindo(a)</h2>

        {/* Botões: mesma largura, alinhados e com áreas laterais iguais */}
        <div className="w-full flex flex-col items-center gap-7">
          {/* Comida */}
          <Link
            href={`/catalog?tab=food${mesaQS}`}
            className="relative w-full max-w-[480px] rounded-[9999px] py-6 px-[72px] text-xl md:text-2xl font-semibold shadow-2xl active:scale-[0.98] transition-transform">
            {/* reserva de espaço lateral esquerda = direita (72px) para manter o texto central */}
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <span className="inline-flex items-center justify-center rounded-full border-2 border-white/60 bg-white/10 backdrop-blur px-2.5 py-2 text-3xl md:text-4xl">🍬</span>
            </span>
            <span className="relative z-[1]">Comida</span>
            <span className="absolute inset-0 -z-[1] rounded-[9999px]" style={{
              background: "linear-gradient(135deg, #ff8a4c 0%, #ff5f6d 100%)",
            }} />
          </Link>

          {/* Bebida */}
          <Link
            href={`/catalog?tab=drinks${mesaQS}`}
            className="relative w-full max-w-[480px] rounded-[9999px] py-6 px-[72px] text-xl md:text-2xl font-semibold shadow-2xl active:scale-[0.98] transition-transform">
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <span className="inline-flex items-center justify-center rounded-full border-2 border-white/60 bg-white/10 backdrop-blur px-2.5 py-2 text-3xl md:text-4xl">🍺</span>
            </span>
            <span className="relative z-[1]">Bebida</span>
            <span className="absolute inset-0 -z-[1] rounded-[9999px]" style={{
              background: "linear-gradient(135deg, #5AB0FF 0%, #2563eb 100%)",
            }} />
          </Link>
        </div>
      </section>

      {/* Rodapé com respiro maior */}
      <footer className="mx-auto w-full max-w-screen-sm px-6 pb-10 pt-2">
        <span className="text-xs opacity-60">© {new Date().getFullYear()} {storeName}</span>
      </footer>
    </main>
  );
}
