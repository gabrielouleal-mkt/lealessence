import { useState } from "react";
import { Wind, Timer, CloudSun, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice, productWhatsAppLink, type Product } from "@/data/catalog";
import { getProfile } from "@/lib/fragrance-profiles";
import { getVariants } from "@/lib/variants";
import { useCart } from "@/lib/cart";
import { WhatsAppIcon } from "./Header";

const LAYERS = [
  {
    key: "top",
    label: "Notas de topo",
    hint: "Primeira impressão · 15 a 30 min",
    width: "w-[68%]",
  },
  {
    key: "heart",
    label: "Notas de coração",
    hint: "Alma da fragrância · 2 a 4 h",
    width: "w-[84%]",
  },
  { key: "base", label: "Notas de fundo", hint: "Rastro duradouro", width: "w-full" },
] as const;

export function ProductDetail({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const profile = getProfile(product.name);
  const { add } = useCart();
  const variants = getVariants(product);
  const [variantId, setVariantId] = useState(variants[0]!.id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0]!;
  const photos = [product.image, ...(product.alternativeImage ? [product.alternativeImage] : [])];
  const [photo, setPhoto] = useState(0);
  const unavailable = product.available === false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-cream">
            <div className="relative aspect-square overflow-hidden">
              {photos.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === 0 ? `${product.name} — ${product.brand}` : ""}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i === photo ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
            {photos.length > 1 && (
              <div className="flex justify-center gap-2 p-3">
                {photos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setPhoto(i)}
                    aria-label={i === 0 ? "Foto principal" : "Foto alternativa"}
                    aria-pressed={i === photo}
                    className={`h-14 w-14 overflow-hidden rounded-md border-2 transition-colors ${i === photo ? "border-primary" : "border-transparent opacity-70"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader className="text-left">
              <p className="text-[0.625rem] font-medium tracking-[0.3em] text-gold-foreground/70 uppercase">
                {product.brand}
              </p>
              <DialogTitle className="font-display text-3xl leading-tight font-medium">
                {product.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detalhes e pirâmide olfativa de {product.name}
              </DialogDescription>
            </DialogHeader>

            {profile && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.family.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-gold/60 px-2.5 py-0.5 text-[0.625rem] tracking-[0.14em] text-gold-foreground uppercase"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {profile ? (
              <>
                <h4 className="eyebrow mt-6">Pirâmide olfativa</h4>
                <ol
                  className="mt-3 flex flex-col items-center gap-2"
                  aria-label="Pirâmide olfativa"
                >
                  {LAYERS.map((layer, i) => (
                    <li
                      key={layer.key}
                      className={`animate-pyramid-in ${layer.width} rounded-xl border border-border bg-gradient-to-b from-card to-cream px-4 py-3 text-center`}
                      style={{ "--pyramid-delay": `${i * 140}ms` } as React.CSSProperties}
                    >
                      <p className="text-[0.625rem] font-semibold tracking-[0.22em] text-primary uppercase">
                        {layer.label}
                      </p>
                      <p className="font-display mt-0.5 text-lg leading-snug text-foreground">
                        {profile[layer.key].join(" · ")}
                      </p>
                      <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">{layer.hint}</p>
                    </li>
                  ))}
                </ol>

                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: Wind, label: "Projeção", value: profile.projection },
                    { icon: Timer, label: "Fixação", value: profile.longevity },
                    { icon: CloudSun, label: "Clima recomendado", value: profile.climate },
                    { icon: Sparkles, label: "Ocasião", value: profile.occasion },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-lg bg-cream px-3 py-2.5">
                      <dt className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
                        <Icon className="size-3.5 text-primary" aria-hidden="true" />
                        {label}
                      </dt>
                      <dd className="mt-1 text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="mt-6 rounded-lg bg-cream px-4 py-3 text-sm text-muted-foreground">
                A pirâmide olfativa deste perfume ainda não foi cadastrada. Fale com a gente no
                WhatsApp e conte o que você procura.
              </p>
            )}

            <div className="mt-7 border-t border-border pt-5">
              {variants.length > 1 && (
                <div className="mb-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Tamanho">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={v.id === variant.id}
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-full border px-3 py-1 text-[0.6875rem] transition-colors ${v.id === variant.id ? "border-primary bg-primary/8 text-primary" : "border-border text-foreground/60 hover:border-primary/40"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-primary">
                  {formatPrice(variant.price)}
                </span>
                {product.originalPrice && variant.id === variants[0]!.id && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {unavailable && (
                <p className="mt-1 text-xs text-muted-foreground">Indisponível no momento</p>
              )}
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  disabled={unavailable}
                  onClick={() => {
                    add(product, variant);
                    onOpenChange(false);
                  }}
                  className="shimmer-gold flex-1 rounded-full bg-primary px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary-foreground uppercase transition-all hover:bg-bordeaux-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Adicionar à sacola
                </button>
                <a
                  href={productWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/25 px-4 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary uppercase transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
