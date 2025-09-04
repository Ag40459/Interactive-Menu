// app/(client)/catalog/_components/ProductCard.tsx
"use client";

import { useState } from "react";

export default function ProductCard(props: {
  name: string;
  description?: string;
  price: number;
  image?: string;
}) {
  const { name, description, price, image } = props;
  const [imgSrc, setImgSrc] = useState<string | undefined>(image);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm shadow-lg">
      <div className="aspect-[4/3] w-full bg-white/10 flex items-center justify-center">
        {/* Fallback de imagem: se 404/erro, troca pra placeholder local */}
        <img
          src={imgSrc ?? "/images/products/placeholder.jpg"}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgSrc("/images/products/placeholder.jpg")}
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">{name}</h3>
        {description ? (
          <p className="mt-1 text-xs opacity-80 line-clamp-2">{description}</p>
        ) : null}
        <div className="mt-2 font-bold">R$ {price.toFixed(2)}</div>
      </div>
    </article>
  );
}