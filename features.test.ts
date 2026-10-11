import { describe, expect, it } from "vitest";
import { BRAND_RAIL_LEFT, BRAND_RAIL_RIGHT, PRODUCTS, type Product } from "@/data/catalog";
import { filterProducts, normalizeBrand, splitHighlight } from "@/lib/catalog-filters";
import { buildOrderMessage, cartCount, cartTotal, type CartLine } from "@/lib/order-message";
import { getProfile } from "@/lib/fragrance-profiles";
import { getVariants } from "@/lib/variants";
import { recommend } from "@/lib/quiz";

const withAlt = (p: Product): Product => ({ ...p, alternativeImage: "x.jpg" });

describe("Filtro de marcas laterais (mesma lógica da ARMAF)", () => {
  const rail = [...BRAND_RAIL_LEFT, ...BRAND_RAIL_RIGHT];
  it("cada marca devolve só produtos dessa marca, nunca de outra", () => {
    for (const brand of rail) {
      const result = filterProducts(PRODUCTS, { brand });
      for (const p of result) expect(normalizeBrand(p.brand)).toBe(normalizeBrand(brand));
    }
  });
  it("Armaf continua filtrando Club de Nuit", () => {
    expect(filterProducts(PRODUCTS, { brand: "Armaf" }).map((p) => p.name)).toEqual([
      "Club de Nuit",
    ]);
  });
  it("Lattafa e Rasasi trazem os produtos corretos", () => {
    expect(filterProducts(PRODUCTS, { brand: "Lattafa" }).length).toBe(
      PRODUCTS.filter((p) => p.brand === "Lattafa").length,
    );
    expect(filterProducts(PRODUCTS, { brand: "Rasasi" }).map((p) => p.name)).toEqual([
      "Hawas Black",
    ]);
  });
  it("marca sem produtos devolve lista vazia, sem inventar itens", () => {
    expect(filterProducts(PRODUCTS, { brand: "Maison Alhambra" })).toEqual([]);
    expect(filterProducts(PRODUCTS, { brand: "Afnan" })).toEqual([]);
  });
  it("ignora caixa e acentos; limpar o filtro devolve tudo", () => {
    expect(filterProducts(PRODUCTS, { brand: "  armaf " }).length).toBe(1);
    expect(filterProducts(PRODUCTS, { brand: null }).length).toBe(PRODUCTS.length);
  });
  it("combina marca + gênero + busca", () => {
    expect(
      filterProducts(PRODUCTS, { brand: "Lattafa", category: "femininos" }).map((p) => p.name),
    ).toEqual(["Fakhar Rosé"]);
    expect(
      filterProducts(PRODUCTS, { brand: null, query: "fakhar ro" }).map((p) => p.name),
    ).toEqual(["Fakhar Rosé"]);
  });
  it("filtra por família olfativa usando as fichas", () => {
    const names = filterProducts(PRODUCTS, {
      brand: null,
      families: ["Especiado"],
      familyOf: (p) => getProfile(p.name)?.family ?? [],
    }).map((p) => p.name);
    expect(names.sort()).toEqual(["Asad Bourbon", "Asad Elixir"]);
  });
});

describe("Destaque da busca", () => {
  it("marca o trecho sem acento/caixa preservando o texto original", () => {
    expect(splitHighlight("Fakhar Rosé", "rose")).toEqual([
      { text: "Fakhar ", match: false },
      { text: "Rosé", match: true },
    ]);
    expect(splitHighlight("Asad", "")).toEqual([{ text: "Asad", match: false }]);
    expect(splitHighlight("Asad", "zzz")).toEqual([{ text: "Asad", match: false }]);
  });
});

describe("Sacola → WhatsApp", () => {
  const lines: CartLine[] = [
    {
      key: "a|frasco",
      productId: "a",
      name: "Asad Bourbon",
      brand: "Lattafa",
      variantId: "frasco",
      variantLabel: "Frasco lacrado",
      unitPrice: 220,
      qty: 2,
    },
    {
      key: "b|5ml",
      productId: "b",
      name: "Hawas Black",
      brand: "Rasasi",
      variantId: "5ml",
      variantLabel: "Decant 5 ml",
      unitPrice: 30,
      qty: 1,
    },
  ];
  it("calcula total e quantidade", () => {
    expect(cartTotal(lines)).toBe(470);
    expect(cartCount(lines)).toBe(3);
  });
  it("gera pedido formatado com itens e total", () => {
    const msg = buildOrderMessage(lines);
    expect(msg).toContain("2x Asad Bourbon (Lattafa) — Frasco lacrado");
    expect(msg).toContain("1x Hawas Black (Rasasi) — Decant 5 ml");
    expect(msg).toMatch(/Total: R\$\s?470,00/);
  });
});

describe("Fichas, variações e quiz", () => {
  it("Asad Bourbon, Hawas Black e Fakhar Rosé têm pirâmide completa", () => {
    for (const n of ["Asad Bourbon", "Hawas Black", "Fakhar Rosé"]) {
      const p = getProfile(n);
      expect(p?.top.length && p?.heart.length && p?.base.length).toBeTruthy();
    }
    expect(getProfile("Perfume sem ficha")).toBeNull();
  });
  it("sem decants cadastrados só existe o frasco (não inventa preço)", () => {
    expect(getVariants({ name: "Asad Bourbon", price: 220 })).toEqual([
      { id: "frasco", label: "Frasco lacrado", price: 220 },
    ]);
  });
  it("quiz recomenda do catálogo real, respeitando o gênero", () => {
    const r = recommend(PRODUCTS, { gender: "femininos", moment: "ambos", style: "floral" });
    expect(r[0]?.product.name).toBe("Fakhar Rosé");
    expect(r.every((x) => x.product.category !== "masculinos")).toBe(true);
    const m = recommend(PRODUCTS, { gender: "masculinos", moment: "noite", style: "especiado" });
    expect(["Asad Bourbon", "Asad Elixir"]).toContain(m[0]?.product.name);
  });
  it("produto sem foto alternativa continua válido", () => {
    expect(withAlt(PRODUCTS[0]!).alternativeImage).toBe("x.jpg");
    expect(PRODUCTS[0]!.alternativeImage).toBeUndefined();
  });
});
