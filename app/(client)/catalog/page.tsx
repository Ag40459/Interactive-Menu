// app/(client)/catalog/page.tsx
import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";
import CategorySelect from "./_components/CategorySelect";
import ProductCard from "./_components/ProductCard";

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

  // Se não vier categories no JSON, derivar a partir dos itens
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
  const title = tab === "drinks" ? "Drinks" : "Food";

  // quando troca de aba, não propagamos category (volta para “all”)
  const qsMesa = mesa ? `&mesa=${encodeURIComponent(mesa)}` : "";

  const selectedCategory = (sp?.category as string | undefined) ?? "all";

  const data = await loadData(tab);
  const categories = data.categories;
  const items =
    selectedCategory === "all"
      ? data.items
      : data.items.filter((it) => it.category === selectedCategory);

  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-white">
      {/* Fundo igual ao da Home */}
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

      <div className="mx-auto w-full max-w-screen-sm px-4 sm:px-6 py-4">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href={`/menu${mesa ? `?mesa=${encodeURIComponent(mesa)}` : ""}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-2 text-sm hover:bg-white/15 transition"
            aria-label="Back"
          >
            ← Back
          </Link>

          <div className="text-center">
            <div className="text-xs opacity-70">{mesa ? `Table ${mesa}` : ""}</div>
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          </div>

          <Link
            href={`/cart?from=catalog&tab=${tab}${qsMesa}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-4 py-2 text-sm hover:bg-white/15 transition"
            aria-label="Cart"
          >
            🛒 Cart
          </Link>
        </header>

        {/* Tabs (não repassam category para resetar em “All”) */}
        <nav className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href={`/catalog?tab=food${qsMesa}`}
            className={`rounded-full px-4 py-2 text-center font-medium border ${
              tab === "food"
                ? "bg-white/20 border-white/30"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            Food
          </Link>
          <Link
            href={`/catalog?tab=drinks${qsMesa}`}
            className={`rounded-full px-4 py-2 text-center font-medium border ${
              tab === "drinks"
                ? "bg-white/20 border-white/30"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            Drinks
          </Link>
        </nav>

        {/* Category (client) – muda a URL na hora */}
        <div className="mt-4">
          <label htmlFor="category" className="block text-sm opacity-80 mb-2">
            Category
          </label>

          <CategorySelect
            id="category"
            tab={tab}
            mesa={mesa}
            categories={categories}
            value={selectedCategory}
          />
        </div>

        {/* Grid de produtos */}
        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.length === 0 ? (
            <div className="col-span-full text-center opacity-80 text-sm">
              No items in this category.
            </div>
          ) : (
            items.map((it) => (
              <ProductCard
                key={it.id}
                name={it.name}
                description={it.description}
                price={it.price}
                image={it.image}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}