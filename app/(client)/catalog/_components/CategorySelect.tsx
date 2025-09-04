// app/(client)/catalog/_components/CategorySelect.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type Category = { id: string; label: string };

export default function CategorySelect(props: {
  id?: string;
  tab: "food" | "drinks";
  mesa?: string;
  categories: Category[];
  value?: string; // “all” por padrão
}) {
  const { id, tab, mesa, categories, value = "all" } = props;
  const router = useRouter();
  const sp = useSearchParams();

  // Garante “All” único
  const options = useMemo(() => {
    const seen = new Set<string>();
    const list: Category[] = [];
    for (const c of categories) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        list.push(c);
      }
    }
    return list;
  }, [categories]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    const base = `/catalog?tab=${tab}${mesa ? `&mesa=${encodeURIComponent(mesa)}` : ""}`;

    const next =
      category && category !== "all" ? `${base}&category=${encodeURIComponent(category)}` : base;

    // preserva outros params não usados? aqui intencionalmente NÃO,
    // pra evitar carregar “lixos” e hidratações diferentes.
    router.replace(next);
  }

  return (
    <select
      id={id}
      name="category"
      value={value}
      onChange={onChange}
      className="w-full rounded-xl bg-white/10 border border-white/20 backdrop-blur px-3 py-2 text-white"
    >
      <option value="all">All</option>
      {options.map((c) => (
        <option key={c.id} value={c.id}>
          {c.label}
        </option>
      ))}
    </select>
  );
}