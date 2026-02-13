"use client";
/* eslint-disable @next/next/no-img-element */
type Props = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  onClick?: () => void;
};

export default function ProductCard({
  name,
  description,
  price,
  image,
  onClick,
}: Props) {
  const priceText = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left rounded-2xl bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 transition overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
      aria-label={`Selecionar ${name}`}
    >
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-28 sm:h-32 object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-28 sm:h-32 grid place-items-center bg-white/10 text-white/70 text-xs">
            sem imagem
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-black" />
      </div>
      <div className="p-3">
        <div className="font-semibold leading-snug">{name}</div>
        {description ? (
          <p className="mt-1 text-xs opacity-80 line-clamp-2">{description}</p>
        ) : null}
        <div className="mt-2 text-sm font-medium">{priceText}</div>
      </div>
    </button>
  );
}