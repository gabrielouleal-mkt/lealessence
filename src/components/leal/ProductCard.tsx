import { useState } from "react";
import { formatPrice, productWhatsAppLink, type Product } from "@/data/catalog";
import { WhatsAppIcon } from "./Header";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className="card-product reveal group flex h-full flex-col overflow-hidden"
      style={{ "--reveal-delay": `${(index % 4) * 90}ms` } as React.CSSProperties}
    >
      <div className="relative overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={`${product.name} — ${product.brand}`}
          loading="lazy"
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {product.onSale && (
            <span className="rounded-full bg-primary px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] text-primary-foreground uppercase">
              Oferta
            </span>
          )}
          <span className="rounded-full bg-card/85 px-3 py-1 text-[0.625rem] font-medium tracking-[0.2em] text-foreground/70 uppercase backdrop-blur">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[0.625rem] font-medium tracking-[0.3em] text-gold-foreground/70 uppercase">
          {product.brand}
        </p>
        <h3 className="font-display mt-1.5 text-2xl leading-tight font-medium text-foreground">
          {product.name}
        </h3>

        {product.description && (
          <div className="mt-2">
            <p
              className={`text-sm leading-relaxed text-muted-foreground transition-all ${open ? "" : "line-clamp-2"}`}
            >
              {product.description}
            </p>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-1 text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase underline-offset-4 hover:underline"
            >
              {open ? "Ver menos" : "Ver detalhes"}
            </button>
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <a
            href={productWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-primary/25 px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
            Consultar no WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
