// app/(client)/catalog/_components/CategorySelect.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; label: string };

type Props = {
  id?: string;
  tab: "food" | "drinks";
  mesa?: string;
  categories: Category[];
  value: string; // "all" ou id
};

export default function CategorySelect({ id, tab, mesa, categories, value }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const options = useMemo(() => {
    const seen = new Set<string>();
    const base = categories.map((c) => ({ id: c.id.trim(), label: c.label.trim() }));
    if (!base.find((c) => c.id === "all")) base.unshift({ id: "all", label: "Todas" });
    else base.forEach((c) => { if (c.id === "all") c.label = "Todas"; });
    return base.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
  }, [categories]);

  const current = options.find((c) => c.id === value) ?? options[0];

  function toURL(catId: string) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (mesa) params.set("mesa", mesa);
    if (catId !== "all") params.set("category", catId);
    return `/catalog?${params.toString()}`;
  }

  function navigate(catId: string) {
    setOpen(false);
    router.push(toURL(catId));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (!btnRef.current) return;
      const target = e.target as Node;
      if (!btnRef.current.parentElement?.contains(target)) setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      window.addEventListener("mousedown", onClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        id={id}
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur
                   px-4 py-3 text-left text-white flex items-center justify-between
                   focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <span className="truncate">{current?.label ?? "Categorias"}</span>
        <span aria-hidden className={`ml-3 transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="
            absolute z-[60] mt-2 left-1/2 -translate-x-1/2
            max-w-[92vw] w-[min(92vw,28rem)]
            max-h-72 overflow-auto rounded-xl border border-white/20
            bg-[#0b0b0bcc] backdrop-blur-md shadow-xl
          "
        >
          {options.map((c) => {
            const active = c.id === current?.id;
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => navigate(c.id)}
                className={`
                  w-full text-left px-4 py-3 text-white
                  ${active ? "bg-white/15 font-semibold" : "hover:bg-white/10"}
                `}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}