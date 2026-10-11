import { BRAND_RAIL_LEFT, BRAND_RAIL_RIGHT } from "@/data/catalog";
import { useSuspenseQuery } from '@tanstack/react-query';
import { productsQuery } from '@/lib/products-query';
import { normalizeBrand } from "@/lib/catalog-filters";

const same = (a: string | null, b: string) => !!a && normalizeBrand(a) === normalizeBrand(b);

/** Marcas reais do catálogo que ainda não aparecem nas listas decorativas. */
function useExtraBrands() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const known = new Set([...BRAND_RAIL_LEFT, ...BRAND_RAIL_RIGHT].map(normalizeBrand));
  const extras: string[] = [];
  for (const p of products) {
    const n = normalizeBrand(p.brand);
    if (!known.has(n)) { known.add(n); extras.push(p.brand.trim()); }
  }
  return extras;
}

interface BrandRailProps {
  onSelectBrand: (brand: string | null) => void;
  activeBrand: string | null;
}

/**
 * Colunas verticais de marcas nas margens do desktop.
 * Representação tipográfica de protótipo (sem logos oficiais).
 * Toda marca é clicável e filtra o catálogo pelo campo de marca real dos produtos.
 */
export function BrandRails({ onSelectBrand, activeBrand }: BrandRailProps) {
  const extras = useExtraBrands();
  // Marcas reais fora das listas fixas entram na coluna mais curta, para as duas caberem na tela.
  const left = [...BRAND_RAIL_LEFT];
  const right = [...BRAND_RAIL_RIGHT];
  const size = (list: string[]) => list.reduce((n, b) => n + b.length, 0);
  for (const b of extras) (size(left) <= size(right) ? left : right).push(b);
  return (
    <>
      <BrandColumn side="left" brands={left} onSelectBrand={onSelectBrand} activeBrand={activeBrand} />
      <BrandColumn side="right" brands={right} onSelectBrand={onSelectBrand} activeBrand={activeBrand} />
    </>
  );
}

function BrandColumn({
  side,
  brands,
  onSelectBrand,
  activeBrand,
}: {
  side: "left" | "right";
  brands: string[];
  onSelectBrand: (brand: string | null) => void;
  activeBrand: string | null;
}) {
  return (
    <aside
      // Tamanho e espaçamento acompanham a altura da tela; centralizado na área abaixo do cabeçalho fixo (80px).
      style={{ fontSize: "clamp(0.625rem, 1.2vh, 0.875rem)", gap: "clamp(0.5rem, 1.5vh, 1.5rem)" }}
      className={`pointer-events-none fixed top-[calc(50%+2.5rem)] z-10 hidden -translate-y-1/2 flex-col items-center 2xl:flex ${
        side === "left" ? "left-6 2xl:left-12" : "right-6 2xl:right-12"
      }`}
      aria-label={`Marcas — coluna ${side === "left" ? "esquerda" : "direita"}`}
    >
      <span style={{ height: "clamp(0.75rem, 3vh, 4rem)" }} className="w-px bg-gradient-to-b from-transparent to-primary/25" aria-hidden="true" />
      {brands.map((brand) => {
        const active = same(activeBrand, brand);
        return (
          <button
            key={brand}
            type="button"
            onClick={() => onSelectBrand(active ? null : brand)}
            aria-pressed={active}
            title={active ? `Remover filtro ${brand}` : `Filtrar por ${brand}`}
            className={`pointer-events-auto cursor-pointer font-display tracking-[0.2em] uppercase transition-all duration-500 [writing-mode:vertical-rl] hover:text-primary ${
              active
                ? "text-primary underline decoration-gold decoration-1 underline-offset-8 opacity-100"
                : "text-primary/35 opacity-60 hover:opacity-100"
            } ${
              side === "left" ? "rotate-180" : ""
            }`}
          >
            {brand}
          </button>
        );
      })}
      <span style={{ height: "clamp(0.75rem, 3vh, 4rem)" }} className="w-px bg-gradient-to-t from-transparent to-primary/25" aria-hidden="true" />
    </aside>
  );
}

/** Faixa horizontal compacta de marcas para telas menores. */
export function BrandMarquee({ onSelectBrand, activeBrand }: BrandRailProps) {
  const extras = useExtraBrands();
  const all = [...BRAND_RAIL_LEFT, ...BRAND_RAIL_RIGHT, ...extras];
  return (
    <div
      className="relative overflow-hidden border-y border-border bg-cream py-5 2xl:hidden"
      aria-label="Marcas trabalhadas"
    >
      <div className="animate-marquee flex w-max items-center gap-12 pr-12 hover:[animation-play-state:paused]">
        {[...all, ...all].map((brand, i) => (
          <span key={`${brand}-${i}`} className="flex items-center gap-12">
            <button
              type="button"
              onClick={() => onSelectBrand(same(activeBrand, brand) ? null : brand)}
              aria-pressed={same(activeBrand, brand)}
              className={`cursor-pointer text-[0.6875rem] font-medium tracking-[0.32em] whitespace-nowrap uppercase transition-colors hover:text-primary ${
                same(activeBrand, brand) ? "text-primary underline decoration-gold underline-offset-8" : "text-primary/50"
              }`}
            >
              {brand}
            </button>
            <span className="text-gold" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent" aria-hidden="true" />
    </div>
  );
}
