import { useState } from "react";
import { formatPrice, productWhatsAppLink, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { getVariants } from "@/lib/variants";
import { splitHighlight } from "@/lib/catalog-filters";
import { WhatsAppIcon } from "./Header";
import { ProductDetail } from "./ProductDetail";

export function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  return (
    <>
      {splitHighlight(text, query).map((part, i) =>
        part.match ? (
          <mark key={i} className="rounded-sm bg-gold/35 px-0.5 text-inherit">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function ProductCard({
  product,
  index = 0,
  query = "",
}: {
  product: Product;
  index?: number;
  query?: string;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  // Em telas sem hover (celular/tablet) a foto alternativa é escolhida pelos indicadores da galeria.
  const [showAlt, setShowAlt] = useState(false);
  const { add } = useCart();
  const variants = getVariants(product);
  const [variantId, setVariantId] = useState(variants[0]!.id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0]!;
  const hasAlt = Boolean(product.alternativeImage);
  const unavailable = product.available === false;

  // Mesma transição e mesma escala nas duas imagens: sem salto de tamanho nem de altura.
  const imgBase =
    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transition-none";

  return (
    <article
      className="card-product reveal group flex h-full flex-col overflow-hidden"
      style={{ "--reveal-delay": `${(index % 4) * 90}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={`${product.name} — ${product.brand}`}
          loading="lazy"
          width={600}
          height={600}
          className={`${imgBase} ${hasAlt ? (showAlt ? "opacity-0" : "opacity-100 group-hover:opacity-0") : ""}`}
        />
        {hasAlt && (
          <img
            src={product.alternativeImage ?? undefined}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={600}
            height={600}
            className={`${imgBase} pointer-events-none ${showAlt ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          />
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {product.onSale && (
            <span className="shimmer-gold rounded-full bg-primary px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] text-primary-foreground uppercase">
              Oferta
            </span>
          )}
          <span className="rounded-full bg-card/85 px-3 py-1 text-[0.625rem] font-medium tracking-[0.2em] text-foreground/70 uppercase backdrop-blur">
            {product.category}
          </span>
        </div>

        {/* Indicador de galeria: aparece só em dispositivos sem hover */}
        {hasAlt && (
          <div
            className="absolute inset-x-0 bottom-3 hidden justify-center gap-2 [@media(hover:none)]:flex"
            role="group"
            aria-label="Fotos do perfume"
          >
            {[false, true].map((alt) => (
              <button
                key={String(alt)}
                type="button"
                aria-label={alt ? "Ver foto alternativa" : "Ver foto principal"}
                aria-pressed={showAlt === alt}
                onClick={() => setShowAlt(alt)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${showAlt === alt ? "w-5 bg-primary" : "w-2 bg-primary/35"}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[0.625rem] font-medium tracking-[0.3em] text-gold-foreground/70 uppercase">
          <Highlight text={product.brand} query={query} />
        </p>
        <h3 className="font-display mt-1.5 text-2xl leading-tight font-medium text-foreground">
          <Highlight text={product.name} query={query} />
        </h3>

        <div className="mt-2">
          {product.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="mt-1 text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase underline-offset-4 hover:underline"
          >
            Ver detalhes
          </button>
        </div>

        <div className="mt-auto pt-5">
          {unavailable && (
            <p className="mb-2 text-xs text-muted-foreground">Indisponível no momento</p>
          )}

          {variants.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Tamanho">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={v.id === variant.id}
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-3 py-1 text-[0.6875rem] transition-colors ${
                    v.id === variant.id
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border text-foreground/60 hover:border-primary/40"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-primary">
              {formatPrice(variant.price)}
            </span>
            {product.originalPrice && variant.id === variants[0]!.id && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={unavailable}
            onClick={() => add(product, variant)}
            className="shimmer-gold mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary-foreground uppercase transition-all duration-300 hover:bg-bordeaux-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Adicionar à sacola
          </button>
          <a
            href={productWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-primary/25 px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-rotate-6" />
            Consultar no WhatsApp
          </a>
        </div>
      </div>

      <ProductDetail product={product} open={detailOpen} onOpenChange={setDetailOpen} />
    </article>
  );
}
