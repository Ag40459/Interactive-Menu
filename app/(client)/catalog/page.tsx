// app/(client)/catalog/page.tsx
import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";
import CategorySelect from "./_components/CategorySelect";
import CatalogGridWithModal from "./_components/CatalogGridWithModal";
import CheckoutBar from "./_components/CheckoutBar";
import CartIcon from "./_components/CartIcon";

type SP = Record<string, string | string[] | undefined>;

type Category = { id: string; label: string };
type Item = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
};
type CatalogData = { categories?: Category[]; items: Item[] };

async function loadData(tab: "food" | "drinks"): Promise<Required<CatalogData>> {
  const filename = tab === "food" ? "food.json" : "drinks.json";
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as CatalogData;

  const categories: Category[] =
    data.categories && data.categories.length
      ? data.categories
      : Array.from(
          new Map(
            data.items.map((it) => [it.category, { id: it.category, label: it.category }])
          ).values()
        );

  return { categories, items: data.items };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await searchParams;

  const mesaParam = (sp?.mesa ?? sp?.table) as string | string[] | undefined;
  const mesa = Array.isArray(mesaParam) ? mesaParam[0] : mesaParam;

  const rawTab = sp?.tab as string | undefined;
  const tab: "food" | "drinks" = rawTab === "drinks" ? "drinks" : "food";
  const tabLabel = tab === "drinks" ? "Bebidas" : "Comida";

  const qsMesa = mesa ? `&mesa=${encodeURIComponent(mesa)}` : "";
  const selectedCategory = (sp?.category as string | undefined) ?? "all";

  const data = await loadData(tab);
  const categories = data.categories;

  const categoryObj =
    selectedCategory === "all"
      ? null
      : categories.find((c) => c.id === selectedCategory) ??
        { id: selectedCategory, label: selectedCategory };

  const items =
    selectedCategory === "all"
      ? data.items
      : data.items.filter((it) => it.category === selectedCategory);

  // se "Todas": mostra "Comida/Bebidas"; senão: só o nome da categoria
  const tituloTopo = categoryObj ? categoryObj.label : tabLabel;

  return (
    <main className="relative min-h-dvh w-full text-white">
      {/* Background */}
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

      <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-4 pb-24">
        {/* Header (fixo) */}
        <div className="sticky top-0 z-50 -mx-4 sm:-mx-6">
          <header
            className="flex items-center justify-between px-4 sm:px-6 py-3
                       bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm"
          >
            <Link
              href={`/menu${mesa ? `?mesa=${encodeURIComponent(mesa)}` : ""}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 
                         backdrop-blur px-3 py-2 text-sm hover:bg-white/15 transition"
              aria-label="Voltar"
              title="Voltar"
            >
              ←
            </Link>

            <div className="text-center">
              <div className="text-xs opacity-70">{mesa ? `Mesa ${mesa}` : ""}</div>
              <h1
                className="text-2xl font-bold leading-tight truncate max-w-[70vw] mx-auto whitespace-nowrap"
                title={tituloTopo}
              >
                {tituloTopo}
              </h1>
            </div>

            <CartIcon href={`/cart?from=catalog&tab=${tab}${qsMesa}`} />
          </header>
        </div>

        {/* Abas */}
        <nav className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href={`/catalog?tab=food${qsMesa}`}
            className={`rounded-full px-4 py-2 text-center font-medium border ${
              tab === "food"
                ? "bg-white/20 border-white/30"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            Comida
          </Link>
          <Link
            href={`/catalog?tab=drinks${qsMesa}`}
            className={`rounded-full px-4 py-2 text-center font-medium border ${
              tab === "drinks"
                ? "bg-white/20 border-white/30"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            Bebidas
          </Link>
        </nav>

        {/* Categoria */}
        <div className="mt-4">
          <label htmlFor="category" className="block text-sm opacity-80 mb-2">
            Categorias
          </label>

          <CategorySelect
            id="category"
            tab={tab}
            mesa={mesa}
            categories={categories}
            value={selectedCategory}
          />
        </div>

        {/* Grid + Modal */}
        <CatalogGridWithModal items={items} />
      </div>

      {/* Barra de finalização */}
      <CheckoutBar href={`/checkout?tab=${tab}${qsMesa}`} />
    </main>
  );
}
