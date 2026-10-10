import { useMemo, useState } from "react";
import { type Category } from "@/data/catalog";
import { useSuspenseQuery } from '@tanstack/react-query';
import { productsQuery } from '@/lib/products-query';
import { ProductCard } from "./ProductCard";

type Filter = "todos" | Category;

interface CatalogProps {
  brand: string | null;
  onBrandChange: (brand: string | null) => void;
}

export function Catalog({ brand, onBrandChange }: CatalogProps) {
  const { data: PRODUCTS } = useSuspenseQuery(productsQuery);
  const CATALOG_BRANDS = [...new Set(PRODUCTS.map(p => p.brand))];
  const [category, setCategory] = useState<Filter>("todos");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      todos: PRODUCTS.length,
      masculinos: PRODUCTS.filter((p) => p.category === "masculinos").length,
      femininos: PRODUCTS.filter((p) => p.category === "femininos").length,
      unissex: PRODUCTS.filter((p) => p.category === "unissex").length,
    }),
    [PRODUCTS],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === "todos" || p.category === category) &&
        (!brand || p.brand === brand) &&
        (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)),
    );
  }, [category, brand, query, PRODUCTS]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "masculinos", label: "Masculinos" },
    { key: "femininos", label: "Femininos" },
    ...(counts.unissex ? [{ key: 'unissex' as const, label: 'Unissex' }] : []),
  ];

  return (
    <section id="catalogo" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">Escolha o seu</p>
          <h2 className="font-display mt-3 text-4xl font-medium text-foreground md:text-5xl">
            Catálogo
          </h2>
          <p className="mt-4 text-muted-foreground">
            Navegue por categoria ou busque pelo nome e pela marca. Cada perfume
            abre uma conversa direta no WhatsApp com o item já identificado.
          </p>
        </div>

        {/* Controles */}
        <div className="reveal mt-12 flex flex-col gap-5">
          <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
            <div className="inline-flex self-center rounded-full border border-border bg-card p-1 md:self-auto" role="tablist">
              {tabs.map((t) => {
                const active = category === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(t.key)}
                    className={`rounded-full px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-all duration-300 sm:px-5 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]"
                        : "text-foreground/60 hover:text-primary"
                    }`}
                  >
                    {t.label} <span className="opacity-60">({counts[t.key]})</span>
                  </button>
                );
              })}
            </div>

            <label className="group relative block md:w-72">
              <span className="sr-only">Buscar perfume</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou marca"
                className="w-full rounded-full border border-border bg-card py-2.5 pr-4 pl-11 text-sm text-foreground transition-all placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-4 focus:ring-ring/20 focus:outline-none"
              />
            </label>
          </div>

          {/* Filtro por marca */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="mr-1 text-[0.625rem] tracking-[0.28em] text-muted-foreground uppercase">
              Marcas
            </span>
            <BrandChip label="Todas" active={!brand} onClick={() => onBrandChange(null)} />
            {CATALOG_BRANDS.map((b) => (
              <BrandChip
                key={b}
                label={b}
                active={brand === b}
                onClick={() => onBrandChange(brand === b ? null : b)}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-[0.6875rem] tracking-[0.28em] text-muted-foreground uppercase" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"}
        </p>

        {filtered.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={`${p.id}-${category}-${brand}`} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-2xl text-foreground">Nenhum perfume encontrado</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente outra busca ou limpe os filtros.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("todos");
                onBrandChange(null);
              }}
              className="mt-5 rounded-full border border-primary/30 px-5 py-2.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-primary uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function BrandChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-xs transition-all duration-300 ${
        active
          ? "border-primary bg-primary/8 text-primary"
          : "border-border text-foreground/60 hover:border-primary/40 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
