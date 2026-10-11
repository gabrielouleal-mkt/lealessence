import type { Product } from "@/data/catalog";
import { normalizeBrand } from "./catalog-filters";

export interface Variant {
  id: string;
  label: string;
  price: number;
}

/**
 * Decants (frascos pequenos) OPCIONAIS por perfume. Chave = nome normalizado do produto.
 * Por padrão está VAZIO: nenhum preço de decant foi informado, então o seletor só aparece
 * quando você preencher aqui. Exemplo:
 *   "asad bourbon": [{ id: "5ml", label: "Decant 5 ml", price: 29.9 }, { id: "10ml", label: "Decant 10 ml", price: 49.9 }],
 */
export const DECANTS: Record<string, Array<{ id: string; label: string; price: number }>> = {};

export const FULL_BOTTLE_ID = "frasco";

export function getVariants(product: Pick<Product, "name" | "price">): Variant[] {
  const decants = DECANTS[normalizeBrand(product.name)] ?? [];
  const full: Variant = { id: FULL_BOTTLE_ID, label: "Frasco lacrado", price: product.price };
  return decants.length ? [full, ...decants] : [full];
}
