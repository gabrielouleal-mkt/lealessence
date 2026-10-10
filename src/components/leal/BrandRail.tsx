import { BRAND_RAIL_LEFT, BRAND_RAIL_RIGHT, CATALOG_BRANDS } from "@/data/catalog";

interface BrandRailProps {
  onSelectBrand: (brand: string | null) => void;
  activeBrand: string | null;
}

/**
 * Colunas verticais de marcas nas margens do desktop.
 * Representação tipográfica de protótipo (sem logos oficiais).
 * Clicar numa marca presente no catálogo filtra os produtos.
 */
export function BrandRails({ onSelectBrand, activeBrand }: BrandRailProps) {
  return (
    <>
      <BrandColumn side="left" brands={BRAND_RAIL_LEFT} onSelectBrand={onSelectBrand} activeBrand={activeBrand} />
      <BrandColumn side="right" brands={BRAND_RAIL_RIGHT} onSelectBrand={onSelectBrand} activeBrand={activeBrand} />
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
      className={`pointer-events-none fixed top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-10 xl:flex ${
        side === "left" ? "left-6 2xl:left-12" : "right-6 2xl:right-12"
      }`}
      aria-label={`Marcas — coluna ${side === "left" ? "esquerda" : "direita"}`}
    >
      <span className="h-16 w-px bg-gradient-to-b from-transparent to-primary/25" aria-hidden="true" />
      {brands.map((brand) => {
        const inCatalog = CATALOG_BRANDS.includes(brand);
        const active = activeBrand === brand;
        return (
          <button
            key={brand}
            type="button"
            disabled={!inCatalog}
            onClick={() => onSelectBrand(active ? null : brand)}
            title={inCatalog ? `Filtrar por ${brand}` : `${brand} — em breve no catálogo`}
            className={`pointer-events-auto font-display text-sm tracking-[0.3em] uppercase transition-all duration-500 [writing-mode:vertical-rl] ${
              active
                ? "text-primary opacity-100"
                : "text-primary/35 opacity-60 hover:opacity-100"
            } ${inCatalog ? "cursor-pointer hover:text-primary" : "cursor-default"} ${
              side === "left" ? "rotate-180" : ""
            }`}
          >
            {brand}
          </button>
        );
      })}
      <span className="h-16 w-px bg-gradient-to-t from-transparent to-primary/25" aria-hidden="true" />
    </aside>
  );
}

/** Faixa horizontal compacta de marcas para telas menores. */
export function BrandMarquee() {
  const all = [...BRAND_RAIL_LEFT, ...BRAND_RAIL_RIGHT];
  return (
    <div
      className="relative overflow-hidden border-y border-border bg-cream py-5 xl:hidden"
      aria-label="Marcas trabalhadas"
    >
      <div className="animate-marquee flex w-max items-center gap-12 pr-12">
        {[...all, ...all].map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="flex items-center gap-12 text-[0.6875rem] font-medium tracking-[0.32em] whitespace-nowrap text-primary/50 uppercase"
          >
            {brand}
            <span className="text-gold" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent" aria-hidden="true" />
    </div>
  );
}
