"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type SP = Record<string, string | string[] | undefined>;

export default function MenuHome({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const [resolvedSearchParams, setResolvedSearchParams] = useState<SP>({});
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");
  const [pendingRoute, setPendingRoute] = useState("");
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const sp = await searchParams;
      setResolvedSearchParams(sp || {});
    };
    resolveParams();
  }, [searchParams]);

  const mesaParam = (resolvedSearchParams?.mesa ?? resolvedSearchParams?.table) as string | string[] | undefined;
  const mesa = Array.isArray(mesaParam) ? mesaParam[0] : mesaParam;
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Pastelaria e Bar da Záza";

  const handleCategoryClick = (category: 'food' | 'drinks') => {
    if (!mesa) {
      setPendingRoute(category);
      setShowModal(true);
    } else {
      const mesaQS = `&mesa=${encodeURIComponent(mesa)}`;
      router.push(`/catalog?tab=${category}${mesaQS}`);
    }
  };

  const handleModalConfirm = () => {
    if (modalName.trim()) {
      const mesaQS = `&mesa=${encodeURIComponent(modalName.trim())}`;
      router.push(`/catalog?tab=${pendingRoute}${mesaQS}`);
      setShowModal(false);
      setModalName("");
      setPendingRoute("");
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalName("");
    setPendingRoute("");
  };

  const mesaQS = mesa ? `&mesa=${encodeURIComponent(mesa)}` : "";

  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-white flex flex-col">
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

      <header className="mx-auto w-full max-w-screen-sm px-6 pt-6 flex items-center justify-between">
        <div className="leading-tight">
          <h1 className="text-lg font-semibold opacity-90">{storeName}</h1>
          <p className="text-xs opacity-70">Faça seu pedido pelo cardápio digital</p>
        </div>
        {mesa ? (
          <div className="rounded-full px-4 py-2 text-sm font-semibold shadow-lg bg-white/10 backdrop-blur border border-white/30">
            Nome {mesa}
          </div>
        ) : null}
      </header>

      {!mesa ? (
        <form method="GET" className="mx-auto mt-6 w-full max-w-screen-sm px-6">
          <label className="sr-only" htmlFor="mesa">Digite Seu Nome</label>
          <div className="flex items-center gap-3 rounded-full border border-white/40 bg-black/20 backdrop-blur px-5 py-3">
            <input
              id="mesa"
              name="mesa"
              placeholder="Digite Seu Nome"
              className="flex-1 bg-transparent outline-none placeholder-white/80 text-white"
            />
            <button className="rounded-full px-4 py-2 text-sm font-semibold bg-white/20 hover:bg-white/30 transition">
              Confirmar
            </button>
          </div>
        </form>
      ) : null}

      <section className="mx-auto w-full max-w-screen-sm px-6 text-center flex flex-col items-center gap-8 md:gap-10 pt-10 md:pt-16 flex-1">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-md">Bem-vindo(a)</h2>

        <div className="w-full flex flex-col items-center gap-7">
          <button
            onClick={() => handleCategoryClick('food')}
            className="relative rounded-[9999px] py-6 px-8 text-xl md:text-2xl font-semibold shadow-2xl active:scale-[0.98] transition-transform"
            style={{
              width: 'calc(100% - 60px)',
              marginRight: '60px',
              maxWidth: '320px'
            }}
          >
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <span className="inline-flex items-center justify-center rounded-full border-2 border-white/60 bg-white/10 backdrop-blur px-2.5 py-2 text-3xl md:text-4xl">🍔</span>
            </span>
            <span className="relative z-[1]">Comida</span>
            <span className="absolute inset-0 -z-[1] rounded-[9999px]" style={{
              background: "linear-gradient(135deg, #ff8a4c 0%, #ff5f6d 100%)",
            }} />
          </button>

          <button
            onClick={() => handleCategoryClick('drinks')}
            className="relative rounded-[9999px] py-6 px-8 text-xl md:text-2xl font-semibold shadow-2xl active:scale-[0.98] transition-transform"
            style={{
              width: 'calc(100% - 60px)',
              marginLeft: '60px',
              maxWidth: '320px'
            }}
          >
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <span className="inline-flex items-center justify-center rounded-full border-2 border-white/60 bg-white/10 backdrop-blur px-2.5 py-2 text-3xl md:text-4xl">🍺</span>
            </span>
            <span className="relative z-[1]">Bebida</span>
            <span className="absolute inset-0 -z-[1] rounded-[9999px]" style={{
              background: "linear-gradient(135deg, #5AB0FF 0%, #2563eb 100%)",
            }} />
          </button>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-screen-sm px-6 pb-10 mt-auto">
        <span className="text-xs opacity-60">© 2025 Pastelaria e Bar da Záza</span>
      </footer>

      {/* Modal para entrada do nome */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleModalCancel} />
          <div className="relative bg-[var(--modal)] rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl">
            <h3 className="text-xl font-semibold text-[var(--brown)] mb-4 text-center">
              Digite seu nome
            </h3>
            <p className="text-[var(--brown)] text-sm mb-6 text-center opacity-70">
              Para continuar, precisamos do seu nome
            </p>
            <input
              type="text"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 border border-[var(--terracotta)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:border-transparent text-[var(--brown)] mb-6 bg-white/20"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleModalCancel}
                className="flex-1 px-4 py-3 border border-[var(--terracotta)] text-[var(--brown)] rounded-lg hover:bg-[var(--rose)] transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleModalConfirm}
                disabled={!modalName.trim()}
                className="flex-1 px-4 py-3 bg-[var(--teal)] text-white rounded-lg hover:bg-[var(--terracotta)] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}